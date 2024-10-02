import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className=' flex items-center justify-center fixed top-0 left-0 w-full h-full bg-white'>
     <div>
     {children}
     </div>
    </div>
  )
}

export default layout
