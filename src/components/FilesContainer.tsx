'use client'
import { trpc } from '@/app/_trpc/client'
import { Loader2, LucideGhost } from 'lucide-react'
import React from 'react'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import { CiTrash } from "react-icons/ci";
import { RxTimer } from "react-icons/rx";
import { Button } from './ui/button'
import { PiChatTeardropTextLight,  } from "react-icons/pi";
import { BsFiletypePdf } from 'react-icons/bs'
const FilesContainer = () => {

    const {data:files,isLoading,refetch} = trpc.getUserFiles.useQuery();

   const  {mutate:deletefile} =  trpc.deleteFile.useMutation({
   
    onSuccess:()=>{
      refetch();
    }
   });
   function formatDate(dateString:string) {
    const date = new Date(dateString);
  
    // Format the date
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC', // or use the specific time zone, e.g., 'America/New_York'
    });
  
    // Return formatted date
    return formatter.format(date).replace(',', '');
  }
 
    
  return (
    <div>
        {
      files && files.length !==0 ? 
     ( <>

<div   className='  flex-col md:flex-row   flex mt-5  md:items-start items-center justify-start w-full h-[70vh] gap-4  container'>  
 {
  files.map((file)=>{
    return(
      
<Link  key={file.id} href={`/dashboard/${file.id}`} className="h-[150px] p-5  w-[400px] flex flex-col items-start justify-between shadow-md border rounded-md bg-slate-50 " >
        <div className="flex  items-center space-x-4">
      <div className="h-12 w-12  " >
      <BsFiletypePdf size={38}/>
      </div>
      <div className="space-y-2">
       <span>{file.name}</span>
       
      </div>

       
    </div>
    <div className=' flex items-center  justify-between w-full text-xs'>
         <span className=' flex items-center gap-2 text-gray-500'> <RxTimer /> {formatDate(file.createdAt)}</span>
         <span className='flex items-center gap-2 text-gray-500 w-40 truncate overflow-hidden whitespace-nowrap'>
  <PiChatTeardropTextLight /> {file.name }
</span>

         <Button  variant={"outline"}  className=' border-red-200 border  flex items-center gap-2 w-20'
          onClick={(event)=>{
            event.preventDefault();
             event.stopPropagation();
            deletefile({id: file.id})
          }}
         > <CiTrash  className=' text-red-500  ' size={20}/> </Button>
      </div>
      </Link>
    )
  })
 }
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
