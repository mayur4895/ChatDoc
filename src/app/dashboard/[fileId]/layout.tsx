import React, { ReactNode } from 'react'

const layoutPage = ({children}:{children:ReactNode}) => {
  return (
    <div className=' container mx-auto border'>
     <div className='  grid grid-cols-2 items-center justify-between gap-5 w-full h-full'>
        
     {
        children
      }
 <div>
 chat container
 </div>
     </div>
    </div>
  )
}

export default layoutPage
