import prisma from "@/app/utils/messenger/libs/prismadb";

async function aiMessageContext(conversationId: string): Promise<boolean> {
  // Get the conversation from the database
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { users: true },
  });

  // Check if the conversation exists
  if (!conversation) {
    throw new Error(`Conversation with ID ${conversationId} not found`);
  }

  // If the conversation exists, it will return true
  return true;
}

export default aiMessageContext;
