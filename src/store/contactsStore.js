import { create } from 'zustand';

const useContactsStore = create((set) => ({
  contacts: [],

  setContacts: (contacts) => set({ contacts }),
}));

export default useContactsStore;