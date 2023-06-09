import { Conversation } from '../../../types/aichat/chat';

export interface ChatbarInitialState {
  searchTerm: string;
  filteredConversations: Conversation[];
}

export const initialState: ChatbarInitialState = {
  searchTerm: '',
  filteredConversations: [],
};