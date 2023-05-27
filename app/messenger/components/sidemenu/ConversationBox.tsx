"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import { FullConversationType } from "@/app/utils/types";
import useOtherUser from "@/app/utils/messenger/useHooks/useOtherUser";
import Avatar from "@/app/messenger/components/Avatar";

interface ConversationBoxProps { data: FullConversationType, selected?: boolean; }

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {router.push(`/messenger/${data.id}`);}, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || []; return messages[messages.length - 1];}, [data.messages]);

  const userEmail = useMemo(() => session.data?.user?.email, [session.data?.user?.email]);
  
  const hasSeen = useMemo(() => { if (!lastMessage) { return false; }
    const seenArray = lastMessage.seen || [];
    if (!userEmail) { return false; }
    return seenArray .filter((user) => user.email === userEmail).length !== 0;}, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => { if (lastMessage?.image) {
    return (
      <span className="text-gray-400">Sent an image</span>
    );
  }

    if (lastMessage?.body) {
      return lastMessage?.body
    }

    return (
      <span className="text-gray-400">Started a conversation</span>
    );
  }, [lastMessage]);

  return ( 
    <div onClick={handleClick} className={clsx('w-full relative flex items-center space-x-3 text-gray-300 hover:bg-neutral-700 rounded-lg transition cursor-pointer p-3', selected ? 'bg-neutral-700' : 'bg-neutral-900')}>
      <Avatar user={otherUser} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-white">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-300 hover:text-black font-light">
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p className={clsx(`truncate text-sm`, hasSeen ? 'text-gray-500' : 'text-black font-medium')}>
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConversationBox;