// Import the prisma instance from the prismadb module
import prisma from "@/app/utils/messenger/libs/prismadb";
// Import the getCurrentUser function to get the current user's data
import getCurrentUser from "./getCurrentUser";

// Define an async function getConversationById to fetch a specific conversation by ID
const getConversationById = async (conversationId: string) => {
  try {
    // If no conversationId is provided, log an error and return null
    if (!conversationId) {
      console.error("No conversationId provided");
      return null;
    }

    // Get the current user's data
    const currentUser = await getCurrentUser();
    // If the current user doesn't have an email, return null
    if (!currentUser?.email) {
      return null;
    }

    // Fetch the conversation with the provided ID from the database,
    // including the users' data
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      },
    });

    // Return the fetched conversation or null if not found
    return conversation;
  } catch (error: any) {
    // In case of an error, log the error and return null as a fallback
    console.log(error, 'SERVER_ERROR');
    return null;
  }
};

// Export the getConversationById function as the default export
export default getConversationById;
