// Import required dependencies and utilities
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { pusherServer } from "@/app/utils/messenger/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Define the default handler function for the API route
export default async function handler(
  request: NextApiRequest, 
  response: NextApiResponse
) {
  // Get session from the next-auth server using the provided request, response, and authOptions
  const session = await getServerSession(request, response, authOptions);

  // If the session doesn't exist or user email is not present, return a 401 Unauthorized response
  if (!session?.user?.email) {
    return response.status(401);
  }

  // Extract socketId and channel name from the request body
  const socketId = request.body.socket_id;
  const channel = request.body.channel_name;

  // Create authorization data object with user_id as email from session
  const data = {
    user_id: session.user.email,
  };

  // Authorize the Pusher channel using socketId, channel, and data
  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  // Send the authorization response back to the client
  return response.send(authResponse);
};
