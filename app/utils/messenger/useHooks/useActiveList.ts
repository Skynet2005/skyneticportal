import { create } from 'zustand';

// Define the ActiveListStore interface with members and corresponding action methods
interface ActiveListStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

// Create a custom Zustand store for managing an active list of items
const useActiveList = create<ActiveListStore>((set) => ({
  // Initialize an empty list of members
  members: [],
  // Action method to add a new member to the list
  add: (id) => set((state) => ({ members: [...state.members, id] })),
  // Action method to remove a specified member from the list
  remove: (id) => set((state) => ({ members: state.members.filter((memberId) => memberId !== id) })),
  // Action method to replace the current list of members with a new list of IDs
  set: (ids) => set({ members: ids })
}));

export default useActiveList;
