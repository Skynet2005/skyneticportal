// api messages route.ts
import { NextResponse } from 'next/server'
import getChatbotResponse from '@/app/utils/messenger/getActions/getChatbotResponse';
import shouldConversationIncludeAIResponse from '@/app/utils/messenger/getActions/shouldConversationIncludeAIResponse';

import getCurrentUser from "@/app/utils/messenger/getActions/getCurrentUser";
import { pusherServer } from '@/app/utils/libs/pusher'
import prisma from "@/app/utils/messenger/libs/prismadb";

// AI User ID from environment variable
const AI_USER_ID = process.env.AI_USER_ID;

// POST request handler for creating a new message and, if necessary, an AI response
export async function POST(
  request: Request,
) {
  try {
    // Retrieve the current user's information
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      message,
      image,
      conversationId
    } = body;

    // Ensure the current user has a valid id and email
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Create a new message in the database
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: true
      },
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId }
        },
        sender: {
          connect: { id: currentUser.id }
        },
        seen: {
          connect: {
            id: currentUser.id
          }
        },
      }
    });

    // Update the conversation with the new message
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true
          }
        }
      }
    });

    // Trigger 'messages:new' event in pusher for the new message
    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    // If the conversation should include an AI response
    if (await shouldConversationIncludeAIResponse(conversationId)) {
      // Generate AI chatbot response
      const aiResponse = await getChatbotResponse(message);

      // Create AI message in the database
      const aiMessage = await prisma.message.create({
        include: {
          seen: true,
          sender: true
        },
        data: {
          body: aiResponse,
          conversation: {
            connect: { id: conversationId }
          },
          sender: {
            connect: { id: AI_USER_ID }
          },
          seen: {
            connect: {
              id: currentUser.id
            }
          },
        }
      });

      // Update the conversation with the AI message
      const updatedConversationWithAIMessage = await prisma.conversation.update({
        where: {
          id: conversationId
        },
        data: {
          lastMessageAt: new Date(),
          messages: {
            connect: {
              id: aiMessage.id
            }
          }
        },
        include: {
          users: true,
          messages: {
            include: {
              seen: true
            }
          }
        }
      });

      // Trigger 'messages:new' event in pusher for the AI message
      await pusherServer.trigger(conversationId, 'messages:new', aiMessage);

      // Notify all users about the new AI message
      updatedConversationWithAIMessage.users.map((user) => {
        pusherServer.trigger(user.email!, 'conversation:update', {
          id: conversationId,
          messages: [aiMessage]
        });
      });
    }

    // Get the last message in the updated conversation
    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    // Notify all users about the new message
    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage]
      });
    });

    // Return the new message as JSON response
    return NextResponse.json(newMessage)
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}
