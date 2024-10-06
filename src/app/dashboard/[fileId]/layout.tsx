import React, { ReactNode } from 'react'

const layoutPage = ({children}:{children:ReactNode}) => {
  return (
    <div className='  mx-2   border'>
     <div className='     grid grid-cols-1 lg:grid-cols-8 items-start justify-between gap-5 w-full h-full'>
        
   <div className=' lg:col-span-5'>
   {
        children
      }
    </div>
 <div className=''>
 chat container
 </div>
     </div>
    </div>
  )
}

export default layoutPage
