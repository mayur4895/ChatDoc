'use client'
import { trpc } from '@/app/_trpc/client'
import { Loader2, LucideGhost } from 'lucide-react'
import React from 'react'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import { IoAddOutline } from "react-icons/io5";
import { RxTimer } from "react-icons/rx";
import { Button } from './ui/button'
import { PiTrashSimpleFill, PiTrashThin } from "react-icons/pi";
const FilesContainer = () => {

    const {data:files,isLoading} = trpc.getUserFiles.useQuery()
  return (
    <div>
        {
      files && files.length !==0 ? 
     ( <>

<div   className='  flex-col md:flex-row flex mt-5  items-start justify-start w-full h-[70vh] gap-4  container'>  

<Link  href="#" className="h-[180px] p-5  w-[400px] flex flex-col items-start justify-between shadow-md border rounded-md bg-slate-50 " >
        <div className="flex  items-center space-x-4">
      <div className="h-12 w-12  bg-slate-950" >

      </div>
      <div className="space-y-2">
       <span>Demo</span>
       <p>size - 183mb</p> 
      </div>

       
    </div>
    <div className=' flex items-center  justify-between w-full'>
         <span className=' flex items-center gap-2 text-gray-500'> <RxTimer /> createdAt</span>
         <span className=' flex items-center gap-2 text-gray-500'> <IoAddOutline /> demo</span>
         <Button  variant={"outline"}  className=' flex items-center gap-2 w-20'> <PiTrashSimpleFill className=' text-red-600' size={22}/> </Button>
      </div>
      </Link>
    </div> 
      </> )
      :

    (  <>
      
      {isLoading  ?
      
      <>
   <div className='  flex-col md:flex-row flex mt-5  justify-start w-full h-[70vh] gap-4  container'>  
     
       {
         Array(3).fill(null).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-[100px] px-5 w-full flex items-center justify-center" >
        <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 " />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    </Skeleton> 
            </div>
          ))
       }
   </div>
      </> :
      
      <>
     <div className=' flex items-center justify-center h-[70vh] w-full'>
  <div className=' text-zinc-600 flex flex-col gap-2 items-center justify-center'>
  <LucideGhost  size={28}/>
 <h2 className=' font-medium text-xl'>pretty empty around here </h2> 
 <p>Lets upload your first pdf</p>
</div>
  </div>
 
    
      </> 
      
      }
      
      
      </>) 
      }
    </div>
  )
}

export default FilesContainer
