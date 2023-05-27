import React from 'react';
import useActiveList from './useActiveList';

// UserOnlineStatus component
interface AIOnlineStatusProps {
  userId: string;
}

const AIOnlineStatus: React.FC<AIOnlineStatusProps> = ({ userId }) => {
  const { members: activeUsers } = useActiveList();

  // Ensure the specific user is always considered active
  const specificUserId = "646f5a36b694ee2a5eaa858f";
  const isActive = activeUsers.includes(userId) || userId === specificUserId;

  return (
    <div>
      {userId}: {isActive ? "Online" : "Offline"}
    </div>
  );
};

export { AIOnlineStatus };
