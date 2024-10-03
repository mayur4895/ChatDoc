 
 'use client'

import Banner from '@/components/Banner';
import Navbar from '@/components/Navbar';
import { useAuth, UserButton, useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
 

const Home =  () => {
 
  const { isSignedIn, user } = useUser()
 
  if(!user || !user.id) redirect("/auth-callback?origin=dashboard") 
  return (
    <div> 
  <Banner/>
 
    </div>
  );
};

export default Home;
