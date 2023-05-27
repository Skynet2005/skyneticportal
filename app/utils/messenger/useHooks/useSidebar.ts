import { create } from 'zustand'

// Define the interface for the sidebar store, containing its state and actions
interface SidebarStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

// Create a Zustand store to manage the sidebar's state and actions
const useSidebar = create<SidebarStore>((set) => ({
  isOpen: false, // Initial state of the sidebar (closed)
  onOpen: () => set({ isOpen: true }), // Action to open the sidebar by updating its state
  onClose: () => set({ isOpen: false }), // Action to close the sidebar by updating its state
}));

export default useSidebar;
