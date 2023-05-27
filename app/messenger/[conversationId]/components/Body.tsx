// 'use client' directive, informs the server that this request is meant to run clientside only.
'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/app/utils/messenger/libs/pusher";
import useConversation from "@/app/utils/messenger/useHooks/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/utils/types";
import { find } from "lodash";

// Body component properties interface
interface BodyProps {
  initialMessages: FullMessageType[];
}

// Body component responsible for displaying messages in a conversation
const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  // Get active conversation ID from custom hook
  const { conversationId } = useConversation();

  // Mark messages as seen whenever the conversation ID changes
  useEffect(() => {
    axios.post(`/api/messenger/conversations/${conversationId}/seen`)
      .catch(error => {
        console.error("Error in axios.post to /api/messenger/conversations/:id/seen:", error);
      });
  }, [conversationId]);

  // Subscribe to new and updated messages using Pusher
  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView();

    // Handle new messages received from the server
    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/messenger/conversations/${conversationId}/seen`)
        .catch(error => {
          console.error("Error in axios.post to /api/messenger/conversations/:id/seen inside messageHandler:", error);
        });

      // Update message state and scroll to the bottom
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message]
      });

      bottomRef?.current?.scrollIntoView();
    };

    // Handle updated messages received from the server
    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }

        return currentMessage;
      }))
    };

    // Bind Pusher events to respective handlers
    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler);

    // Cleanup when the component is unmounted or conversation ID changes
    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto bg-black scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-400">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
}

export default Body;
