// Import the prisma instance from the prismadb module
import prisma from "@/app/utils/messenger/libs/prismadb";
// Import the getCurrentUser function to get the current user's data
import getCurrentUser from "./getCurrentUser";

// Define an async function getConversations to fetch the conversations for the current user
const getConversations = async () => {
  // Get the current user's data
  const currentUser = await getCurrentUser();

  // If the current user doesn't have an ID, return an empty array
  if (!currentUser?.id) {
    return [];
  }

  try {
    // Fetch the conversations for the current user from the database
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser.id
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          }
        },
      }
    });

    // Return the fetched conversations
    return conversations;
  } catch (error: any) {
    // In case of an error, return an empty array
    return [];
  }
};

// Export the getConversations function as the default export
export default getConversations;
