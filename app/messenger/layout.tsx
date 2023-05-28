// Import Dependencies
import getConversations from "@/app/utils/messenger/getActions/getConversations";
import Sidebar from "./components/sidebar/Sidebar";
import ConversationList from "@/app/messenger/components/sidemenu/ConversationList";
import getUsers from "@/app/utils/messenger/getActions/getUsers";

// Define the ConversationsLayout component that encompasses the Sidebar and ConversationList
export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch conversation data using getConversations function
  const conversations = await getConversations();

  // Extract users from all conversations by flat mapping the 'users' property of each conversation
  const users = await getUsers();

  return (
    // @ts-expect-error Server Component (This comment explains why we're expecting a TypeScript error)
    <Sidebar>
      <div className="h-full">
        {/* Pass conversations and users as props to ConversationList component */}
        <ConversationList initialItems={conversations} users={users} />
        {/* Render child components passed into ConversationsLayout */}
        {children}
      </div>
    </Sidebar>
  );
}
