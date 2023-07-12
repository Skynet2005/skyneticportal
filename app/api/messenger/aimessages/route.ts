import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { CallbackManager } from "langchain/callbacks";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage, HumanMessage } from "langchain/schema";

import getCurrentUser from '@/app/utils/messenger/getActions/getCurrentUser';
import { NextResponse } from "next/server";
import prisma from '@/app/utils/messenger/libs/prismadb';
import { pusherServer } from '@/app/utils/messenger/libs/pusher';
import aiMessageContext from '@/app/utils/messenger/getActions/aiMessageContext';

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    // Check if the currentUser exists (has id and email)
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { messages, conversationId } = await req.json();

    const { stream, handlers } = LangChainStream();

    const llm = new ChatOpenAI({
      streaming: true,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });

    llm
      .call(
        (messages as Message[]).map((m) =>
          m.role == "user"
            ? new HumanMessage(m.content)
            : new AIMessage(m.content)
        )
      )
      .catch(console.error);

    if (await aiMessageContext(conversationId)) {
      const AI_USER_ID = process.env.AI_USER_ID;

      for (let message of messages) {
        const newMessage = await prisma.message.create({
          data: {
            body: message.content,
            conversation: {
              connect: { id: conversationId }
            },
            sender: {
              connect: { id: message.role == "user" ? currentUser.id : AI_USER_ID }
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

        // Notify all users about the new message
        updatedConversation.users.map((user) => {
          pusherServer.trigger(user.email!, 'conversation:update', {
            id: conversationId,
            messages: [newMessage]
          });
        });
      }
    }

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error', { status: 500 });
  }
}
