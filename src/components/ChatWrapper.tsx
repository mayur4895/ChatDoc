'use client'
import { trpc } from '@/app/_trpc/client'
import { Cross2Icon } from '@radix-ui/react-icons'
import { CrossIcon, Loader2 } from 'lucide-react'
import React from 'react'
import { string } from 'zod'
import { GiTerror } from "react-icons/gi";
import { Button } from './ui/button'
import { IoReturnDownBackOutline } from "react-icons/io5";
import Link from 'next/link'
import Messages from './Messages'
import ChatInput from './ChatInput'
import MessageProvider from './providers/MessageProvider'

interface ChatWrapperProps{
    fileId:string  
}
const ChatWrapper = ({fileId}:ChatWrapperProps) => {


    const {  data, isLoading} = trpc.getFileUploadStatus.useQuery({
        fileId,
    }, {
        refetchInterval:(data:any)=>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500
       }  
         );
   
       
 

    
    if(isLoading){
        return(
           <div className='flex items-center justify-center w-full h-[85vh]'>
           <div className='text-center flex items-center flex-col gap-5'>
             <Loader2 className='animate-spin' size={22} />
             <span>we are Preparing your PDF...</span>
           </div>
         </div>
        )
       }
   

       if(data?.status === "PROCESSING"){
        return(
            <div className='flex items-center justify-center w-full h-[85vh]'>
            <div className='text-center flex items-center flex-col gap-5'>
              <Loader2 className='animate-spin' size={22} />
              <span> We are Processing your PDF...</span>
            </div>
          </div>
         )
       }


       if(data?.status === "FAILED"){
        return(
            <div className='flex items-center justify-center w-full h-[85vh]'>
            <div className='text-center flex items-center flex-col gap-5'>
              <GiTerror   className='text-gray-600' size={42} />
              <p>To many pages in pdf</p>
              <span className='text-gray-600'> You are in free plan supports up to 5 pages</span>
             <Link href={"/dashboard"}>  <Button variant={"outline"} className='flex items-center gap-2 '><IoReturnDownBackOutline size={22}/> Back to Dashboard</Button></Link>
            </div>
          </div>
         )
       }


   
  return (
    <MessageProvider fileId={fileId}>

<div className=' w-full p-4  relative bg-white divide-emerald-800 flex  justify-between flex-col h-[calc(75vh)]  '>
        <div className=' flex-1   justify-between flex flex-col mb-2 bg'>
        <Messages/> 
        </div>
   
    </div>
    </MessageProvider>
  )
}

export default ChatWrapper
