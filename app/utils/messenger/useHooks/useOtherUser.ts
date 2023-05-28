import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../../../types/messenger";
import { User } from "@prisma/client";

// Hook to extract the other user from a conversation
const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
  // Access current session data using the useSession hook
  const session = useSession();

  // Compute other user by filtering out the current user from the list of users in the conversation
  const otherUser = useMemo(() => {
    // Get the current user's email
    const currentUserEmail = session.data?.user?.email;

    // Filter out the current user based on the email
    const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);

    // Return the first element, assuming that there are only two users in the conversation
    return otherUser[0];
  }, [session.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
