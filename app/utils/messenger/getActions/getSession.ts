import { getServerSession } from "next-auth";

// Import the authOptions configuration object for NextAuth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Define an async function getSession to get the server-side session using NextAuth
export default async function getSession() {
  // Return the result of calling getServerSession with the provided authOptions
  return await getServerSession(authOptions);
}
