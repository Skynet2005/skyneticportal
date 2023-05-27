import { useEffect, useState } from "react";
import { pusherClient } from "../../messenger/libs/pusher";
import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";

// Hook for managing active channels
const useActiveChannel = () => {
  // Access the action methods from useActiveList store
  const { set, add, remove } = useActiveList();
  
  // State hook to store the active channel and its setter
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  // Side effect that initializes the channel and manages its events
  useEffect(() => {
    let channel = activeChannel;

    // Subscribe to 'presence-messenger' channel if not already subscribed
    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger');
      setActiveChannel(channel);
    }

    // Bind event listener to handle subscription success
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      // Extract member IDs from retrieved members and initialize the list
      members.each((member: Record<string, any>) => initialMembers.push(member.id));
      set(initialMembers);
    });

    // Bind event listener to handle when a new member is added
    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id)
    });

    // Bind event listener to handle when a member is removed
    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });

    // Cleanup function for unsubscribing from the channel and resetting the state
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger');
        setActiveChannel(null);
      }
    }
  }, [activeChannel, set, add, remove]);
}

export default useActiveChannel;


