// Import the prisma instance from the prismadb module
import prisma from "@/app/utils/messenger/libs/prismadb";
// Import the getSession function to get the user's authenticated session
import getSession from "./getSession";

// Define an async function getCurrentUser to fetch the current user's data from the database
const getCurrentUser = async () => {
  try {
    // Get the user's current session
    const session = await getSession();

    // If the user is not authenticated or doesn't have an email, return null
    if (!session?.user?.email) {
      return null;
    }

    // Fetch the current user's data from the database using their email as a unique identifier
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      }
    });

    // If the currentUser is not found in the database, return null
    if (!currentUser) {
      return null;
    }

    // Return the fetched current user's data
    return currentUser;
  } catch (error: any) {
    // In case of an error, return null
    return null;
  }
};

// Export the getCurrentUser function as the default export
export default getCurrentUser;
