"use client";

// Import necessary hooks and functions from React and Next.js
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";

// Import format function from date-fns for formatting dates
import { format } from "date-fns";
import { useSession } from "next-auth/react";  // useSession from next-auth for session management
import clsx from "clsx";
import { FullConversationType } from "@/app/types/messenger"; // Import custom types and hooks
import useOtherUser from "@/app/utils/messenger/useHooks/useOtherUser";
import Avatar from "@/app/messenger/components/Avatar";
import AvatarGroup from "@/app/messenger/components/AvatarGroup";

// Define the type for ConversationBoxProps
interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

// Define the ConversationBox functional component
const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
  // To pass other users message
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  // Define the handleClick function to navigate to messenger page with conversation ID
  const handleClick = useCallback(
    () => {
      router.push(`/messenger/${data.id}`);
    },
    [data.id, router]
  );

  // Memoize the value of lastMessage (puts below User name)
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  // Get userEmail from session
  const userEmail = useMemo(() => session.data?.user?.email, [
    session.data?.user?.email,
  ]);

  // Memoize hasSeen value, returns true if user has seen the last message
  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }
    const seenArray = lastMessage.seen || [];
    if (!userEmail) {
      return false;
    }
    return (
      seenArray.filter((user) => user.email === userEmail).length !== 0
    );
  }, [userEmail, lastMessage]);

  // Define lastMessageText depending on the type of content in the last message
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return <span className="text-gray-400">Sent an image</span>;
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return (
      <span className="text-gray-400">Started a conversation</span>
    );
  }, [lastMessage]);


  // Return the JSX to render the ConversationBox component
  return (
    // Create a div container 
    <div
      // Set onClick event handler to navigate to messenger page with conversation ID
      onClick={handleClick}
      // Apply dynamic class names using clsx, based on whether the conversation is selected or not
      className={clsx("w-full relative flex items-center space-x-3 text-gray-300 hover:bg-neutral-700 rounded-lg transition cursor-pointer p-3",
        selected ? "bg-neutral-700" : "bg-neutral-900"
      )}
    >
      {data.isGroup ? ( 
        <AvatarGroup users={data.users} /> 
      ) : (
        <Avatar user={otherUser} />
      )};
      {/* // Create a div with a flexible width (min-w-0) and occupy all available space (flex-1) */}
      <div className="min-w-0 flex-1">
        {/* // Create a div to remove default focus outline when clicking on elements within it */}
        <div className="focus:outline-none">
          {/* // Add an invisible span element absolutely positioned inside the parent container for accessibility reasons */}
          <span className="absolute inset-0" aria-hidden="true" />
          {/* // Create a flex container to display the conversation name and last message timestamp side by side */}
          <div className="flex justify-between items-center mb-1">
            {/* // Display either the conversation name or the other user's name if there's no conversation name */}
            <p className="text-md font-medium text-white">
              {data.name || otherUser.name}
            </p>
            {/* // If the lastMessage has a createdAt timestamp, format and display it */}
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-300 hover:text-gray-600 font-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          {/* // Display the last message text, truncate it if it exceeds the container width */}
          <p
            className={clsx(
              "truncate text-sm",
              hasSeen ? "text-gray-600" : "text-gray-100 font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};
  

// Export the ConversationBox component
export default ConversationBox;
