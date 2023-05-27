import getConversations from "@/app/utils/messenger/getActions/getConversations";
import Sidebar from "./components/sidebar/Sidebar";
import ConversationList from "@/app/messenger/components/sidemenu/ConversationList";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
}) {
  const conversations = await getConversations();
  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">
        <ConversationList 
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  );
}