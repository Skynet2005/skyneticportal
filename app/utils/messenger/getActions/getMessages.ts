import prisma from "@/app/utils/messenger/libs/prismadb";

// Declare a getMessages function that takes a conversationId as an argument
const getMessages = async (
  conversationId: string
) => {
  try {
    // Query the database to fetch all messages in a conversation
    const messages = await prisma.message.findMany({
      where: {
        // Filter messages based on the passed-in conversationId
        conversationId: conversationId
      },
      include: {
        // Include sender data along with each message
        sender: true,
        // Include seen status data along with each message
        seen: true,
      },
      orderBy: {
        // Sort the fetched messages by their createdAt timestamps in ascending order
        createdAt: 'asc'
      }
    });

    // Return the fetched messages
    return messages;
  } catch (error: any) {
    // If there's an error while fetching the messages, return an empty array
    return [];
  }
};

// Export the getMessages function as the default export of this module
export default getMessages;
