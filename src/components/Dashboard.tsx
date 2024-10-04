 
import React from 'react' 
import { UploadDilog } from './models/upload-file-modal' 
import FilesContainer from './FilesContainer'

const Dashboard = () => {

 
  return (
    <div className='container w-full m-auto'>
      <div className=' flex items-center justify-between w-full p-2  '>
        <h2 className=' text-2xl font-semibold'>My Files</h2>
        <UploadDilog/>
      </div>
        <FilesContainer/>
     
    </div>
  )
}

export default Dashboard
