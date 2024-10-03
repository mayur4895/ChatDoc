import React from 'react';
import { BackgroundLines } from './ui/background-lines';
import { Button } from './ui/button';

const Banner = () => {
  return (
    <div className=' h-full w-full'>     
     <BackgroundLines> 
    <div className="md:mt-20 h-auto    overflow-hidden   flex flex-col items-center">
     
        <div className='z-20 flex items-center flex-col md:pt-0 pt-40'>
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-800 to-neutral-700 dark:from-neutral-600 dark:to-white text-4xl md:text-5xl lg:text-6xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
            Chats With Your Document, <br /> Using ChatDoc.
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
            Allow of you conversation with any PDF document. Simplify upload your PDF and start asking questions to your document.
          </p>
          <Button className='cursor-pointer mt-5'>Get Started</Button>
        </div>

   
         
        
        <div className=' md:w-[600px] w-[500px] h-[500px] relative mt-2 z-20 '> 
        <div className="absolute   top-0 right-0  flex    ">
          <div className="bg-gradient-to-br from-red-500 to-purple-500   -translate-y-14 blur-lg opacity-20 rounded-full w-[300px] h-[300px] -z-10    "></div>
          <div className="bg-gradient-to-br from-blue-500 to-red-600  translate-x-16  translate-y-16  blur-lg opacity-20 rounded-full w-[300px] h-[300px] -z-10    "></div>
        </div> 
        <img className=' w-[450px] md:w-[600px] mx-auto relative z-10  drop-shadow-xl' src='/screen.png' alt='chatdoc logo' />
              </div> 
       
   
  
    </div>
    </BackgroundLines>
    </div>

  );
};

export default Banner;
