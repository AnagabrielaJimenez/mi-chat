import supabase from './supabase';
import useMessagesStore from '../store/messagesStore';

export function subscribeToMessages() {
  return supabase
    .channel('messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
      useMessagesStore.getState().addMessage(payload.new);
    })
    .subscribe();
}
