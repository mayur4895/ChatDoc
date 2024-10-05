'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircleFadingPlus } from "lucide-react"
import UploadDropzone from "../ui/UploadDropzone"
import { TbSquareRoundedPlusFilled } from "react-icons/tb";

export function UploadDilog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className=' flex items-center gap-4'>Add File <TbSquareRoundedPlusFilled  size={22}/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]" >
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle> 
        </DialogHeader>
  
     <div>
     <UploadDropzone/>
     </div>
     
      </DialogContent>
    </Dialog>
  )
}
