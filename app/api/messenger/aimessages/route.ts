import getCurrentUser from '@/app/utils/messenger/getActions/getCurrentUser';
import { NextResponse } from "next/server";
import prisma from '@/app/utils/messenger/libs/prismadb';
import { pusherServer } from '@/app/utils/messenger/libs/pusher';
import getChatbotResponse from '@/app/utils/messenger/getActions/getChatbotResponse';
import aiMessageContext from '@/app/utils/messenger/getActions/aiMessageContext';

import { OpenAIModelID } from '@/app/types/aichat/openai';

// POST request handler for sending messages 
export async function POST(
  request: Request,
) {
  try {
    // Get current user details
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      message,
      image,
      openaiModel,
      conversationId
    } = body;

    // Check if the currentUser exists (has id and email)
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

    // Notify all users about the new message using pusher
    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    // Check if AI Message Context is enabled for this conversation
    if (await aiMessageContext(conversationId)) {
      // Get AI response for the user's message
      const aiResponse = await getChatbotResponse(message, openaiModel as OpenAIModelID);

      const AI_USER_ID = process.env.AI_USER_ID;
      
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

    // Return the created message as JSON response
    return NextResponse.json(newMessage)
  } catch (error) {
    console.log(error, 'ERROR_AIMESSAGES_API')
    // In case of an error, return a generic error response with status 500
    return new NextResponse('Error', { status: 500 });
  }
}
