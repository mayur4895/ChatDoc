import { create } from 'zustand';
import axios from 'axios';

// Define the state and actions for the message store
interface MessageState {
  message: string;
  isLoading: boolean;
  setMessage: (message: string) => void;
  addMessage: (fileId: string) => Promise<void>;
}

// Create the Zustand store
export const useMessageStore = create<MessageState>((set, get) => ({
  message: '',
  isLoading: false,

  // Action to set the message value from textarea input
  setMessage: (message: string) => set({ message }),

  // Action to add a message via API
  addMessage: async (fileId: string) => {
    set({ isLoading: true });

    try {
      const message = get().message; // Access current message state
      await axios.post('/api/messages', { fileId, message });

      set({ message: '' }); // Clear message after successful submission
    } catch (error) {
      console.error('Error adding message:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
