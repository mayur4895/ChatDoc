import React, { ReactNode } from 'react'

const layoutPage = ({children}:{children:ReactNode}) => {
  return (
    <div className='  mx-2   border'>
     <div className='     grid grid-cols-1 lg:grid-cols-2 items-start justify-between gap-5 w-full h-full'>
        
     {
        children
      }
 <div className=''>
 chat container
 </div>
     </div>
    </div>
  )
}

export default layoutPage
