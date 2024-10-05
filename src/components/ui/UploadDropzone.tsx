import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Label } from './label';
import { Cloud, File, Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';

const UploadDropzone = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
const router = useRouter();
  const { toast } = useToast();

  const { startUpload  } = useUploadThing('pdfUploader');

  const {mutate:startPolling,isPending} = trpc.getfile.useMutation(
     {
     
    onSuccess:(file)=>{
      
      router.push(`/dashboard/${file.id}`)
    },
    
    retry:true,
    retryDelay:500
  })

  const startSimulateProgress = () => {
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(100), 50);
          return prevProgress;
        }
        return prevProgress + 10;
      });
    }, 100);

    return interval;
  };

  return (
    <div>
      <Dropzone
        multiple={false}
        onDrop={async (acceptedFiles) => {
          setIsUploading(true);
          const     progressInterval = startSimulateProgress();

       
            const res = await startUpload(acceptedFiles);
            if (!res) {
              toast({
                title: 'Error',
                description: 'Failed to upload file',
              });
              setIsUploading(false);
              return;
            }

            const [fileResponse] = res;
            const key = fileResponse?.key;

            if (!key) {
              toast({
                title: 'Error',
                description: 'Failed to upload file',
              });  
            }  
            clearInterval(progressInterval);
            setUploadProgress(100);
            startPolling({key});
        }}  
      >
        {({ getInputProps, getRootProps, acceptedFiles }) => (
          <div
            {...getRootProps()}
            className="h-72 border border-dashed m-4 border-gray-300 bg-zinc-100/70"
          >
            <input {...getInputProps()} />
            <div className="flex items-center justify-center h-full w-full">
              <Label
                htmlFor="dropzone-file"
                className="text-gray-600 flex-col w-full h-full flex justify-center items-center"
              >
                <div className="w-full h-auto mb-5 flex flex-col gap-2 justify-center items-center m-2">
                  <Cloud size={30} />
                  <p className="items-center text-center">
                    <span className="font-semibold">Click to upload</span> or
                    Drag and drop
                  </p>
                  <p className="mt-2 text-zinc-500">
                    pdf (up to <span className="font-semibold">4MB</span>)
                  </p>
                </div>

                {acceptedFiles.length > 0 && (
                  <div className="max-w-xs p-2 w-full bg-white h-12 rounded-md overflow-hidden border flex items-center justify-center">
                    <File size={20} className="text-blue-500" />
                    <div className="mt-2 px-3 py-2 items-center flex justify-center h-full text-gray-600 truncate">
                      {acceptedFiles[0].name}
                    </div>
                  </div>
                )}

                {acceptedFiles.length > 0 &&
                  acceptedFiles[0].size > 4 * 1024 * 1024 && (
                    <p className="text-red-500">File size exceeds 4MB</p>
                  )}

                {isUploading && (
                  <div className="max-w-xs mx-auto mt-4 w-full">
                    <Progress
                      value={uploadProgress}
                      className="w-full bg-zinc-200"
                    />
                  </div>
                )}


                {
                  isPending && (
                    <div className=' text-center items-center mt-2 flex flex-col gap-2 w-full'>
                      <Loader2 className=' animate-spin'/>
                      <p>You will redirecting.. </p>
                    </div>
                  )
                }
           
              </Label>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default UploadDropzone;
