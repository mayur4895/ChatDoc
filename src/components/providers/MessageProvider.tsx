import ChatInput from '@/components/ChatInput';
import { useMessageStore } from '@/hooks/store/useMessageStore';
import React from 'react';
 

interface MessageProviderProps {
  fileId: string;
  children: React.ReactNode;
}

const MessageProvider: React.FC<MessageProviderProps> = ({ fileId, children }) => {
  const { message, setMessage, addMessage, isLoading } = useMessageStore();

  // Handler for adding the message
  const handleAddMessage = async () => {
    if (message.trim()) {
      await addMessage(fileId); // Call the mutation with fileId
      setMessage(''); // Clear the message after sending
    }
  };

  return (
    <div className="border">
      
 
      {children}
      <ChatInput 
        userInputMessage={message} 
        onInputChange={(value:string) => setMessage(value)} 
        onSubmitInput={handleAddMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default MessageProvider;
