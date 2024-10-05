 

'use client'; 
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { trpc } from '../_trpc/client';
import { Loader2} from "lucide-react"
const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');

  const { data, isLoading, error } = trpc.authCallback.useQuery();

  useEffect(() => {
    if (error) {
      console.error("Error during auth callback:", error);
    }

    if (data?.success) {
   
      if (origin) {
          router.push(origin);  
      } else {
          router.push('/');  
      }
    }
  }, [data, error, origin, router]);

  if (isLoading) {
    return <div className='w-full h-[80vh] flex items-center justify-center'>
<div className=' flex flex-col gap-4 items-center justify-center'>
 <Loader2 className=' animate-spin' size={25}/>
 <h2 className=' font-semibold text-2xl'>Setting Up Your Account</h2>
 <span>You will be  redirect automatically  </span>
</div>

    </div>;
  }

  
};

export default AuthCallback;
