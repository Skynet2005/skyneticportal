import prisma from "@/app/utils/messenger/libs/prismadb";

const AI_USER_ID = process.env.AI_USER_ID;

async function shouldConversationIncludeAIResponse(conversationId: string): Promise<boolean> {
  // Get the conversation from the database
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { users: true },
  });

  // Check if the conversation exists
  if (!conversation) {
    throw new Error(`Conversation with ID ${conversationId} not found`);
  }

  // Check if the conversation includes the AI user
  const includesAIUser = conversation.users.some(user => user.id === AI_USER_ID);

  return includesAIUser ?? false; // Provide a default value of false if includesAIUser is undefined
}

export default shouldConversationIncludeAIResponse;
