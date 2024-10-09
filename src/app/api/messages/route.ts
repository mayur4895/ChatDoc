import { db } from "@/lib/db";
import { SendMessageValidator } from "@/validators/sendMessageValidator";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";




 export const POST = async(req:NextRequest)=>{
const body =  await req.json();

 const user = await currentUser();

 if(!user?.id){
return new Response('UNAUTHORIZE',{status: 401})
 }

 const { message, fileId} =  SendMessageValidator.parse(body);


 const file = await db.file.findFirst({
    where:{
        id: fileId,
        userId: user.id
    }
 })


 if(!file){
    return new Response('File not found',{status: 404})
 }

 await db.message.create({
 data:{
  text:message,
  isUserMessage:true,
  userId:user.id,
  fileId
  
 }
 })
//

 return new Response('Message sent successfully',{status: 200})
 }