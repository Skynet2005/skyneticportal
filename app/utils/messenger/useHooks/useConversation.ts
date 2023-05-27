import { useParams } from "next/navigation";
import { useMemo } from "react";

// Custom hook to manage conversation state
const useConversation = () => {
  // Get route parameters using the Next.js navigation hook
  const params = useParams();

  // Determine and memoize the current conversation ID from route parameters
  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return '';
    }

    return params.conversationId as string;
  }, [params?.conversationId]);

  // Memoize whether the conversation is open or not based on the presence of a conversation ID 
  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  // Return an object containing the conversation state
  return useMemo(() => ({
    isOpen,
    conversationId
  }), [isOpen, conversationId]);
};

export default useConversation;
