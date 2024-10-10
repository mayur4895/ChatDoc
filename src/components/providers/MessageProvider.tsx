import ChatInput from '@/components/ChatInput';
import { useMessageStore } from '@/hooks/store/useMessageStore';
import React from 'react';
 

interface MessageProviderProps {
  fileId: string;
  children: React.ReactNode;
}

const MessageProvider: React.FC<MessageProviderProps> = ({ fileId, children }) => {
  const { message, setMessage, addMessage, isLoading } = useMessageStore();

 
  const handleAddMessage = async () => {
    if (message.trim()) {
      await addMessage(fileId);  
      setMessage('');  
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
