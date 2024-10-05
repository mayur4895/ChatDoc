import PdfRender from '@/components/PdfRender';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
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

  console.log({'file':file});
  
 
  return (
    <div>
 
    </div>
  );
};

export default FilePage;
