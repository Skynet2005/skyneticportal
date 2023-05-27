// Import the prisma instance from the prismadb module
import prisma from "@/app/utils/messenger/libs/prismadb";
// Import the getSession function to get the user's authenticated session
import getSession from "./getSession";

// Define an async function getUsers to fetch users from the database
const getUsers = async () => {
  // Get the user's current session
  const session = await getSession();

  // If the user is not authenticated or doesn't have an email, return an empty array
  if (!session?.user?.email) {
    return [];
  }

  try {
    // Fetch all users from the database, ordering by created_at in descending order,
    // excluding the current logged-in user's email from the result set
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        NOT: {
          email: session.user.email
        }
      }
    });

    // Return the fetched users
    return users;
  } catch (error: any) {
    // In case of an error, return an empty array
    return [];
  }
};

// Export the getUsers function as the default export
export default getUsers;
