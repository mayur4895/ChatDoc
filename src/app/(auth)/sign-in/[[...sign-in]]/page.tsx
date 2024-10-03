// pages/sign-in.tsx
'use client'

import { useEffect } from 'react';
import { SignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
    
      router.push('/dashboard');  
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div>
      <SignIn  routing="hash"/>
    </div>
  );
};

export default SignInPage;
