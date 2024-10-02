 
 

import Banner from '@/components/Banner';
import Navbar from '@/components/Navbar';
import { UserButton } from '@clerk/nextjs';
import React from 'react';
 

const Home = async() => {
 

  return (
    <div>
  <Navbar/>
  <Banner/>
    </div>
  );
};

export default Home;
