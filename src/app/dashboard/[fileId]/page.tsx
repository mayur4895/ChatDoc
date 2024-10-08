 
import ChatWrapper from '@/components/ChatWrapper';
import PdfRender from '@/components/PdfRender';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

interface PageProps {
  params: { fileId: string };
}

const FilePage = async ({ params }: PageProps) => {
  const fileId = params['fileId']; 

  const user = await currentUser(); 
  
  if (!user) { 
    redirect(`/auth-callback?origin=/dashboard/${fileId}`);
  }
 
  const file = await db.file.findFirst({
    where: {
      userId: user.id,
      id: fileId,
    },
  });

  console.log({'file':file?.url});
  
  if(!file) notFound();
 
  return (
     
 
        
        <div    className='          grid lg:grid-cols-2'>
         
         <PdfRender  pdfUrl={file.url} />  
        <ChatWrapper  fileId={file.id}/>
      </div>
        
  
  );
};

export default FilePage;
