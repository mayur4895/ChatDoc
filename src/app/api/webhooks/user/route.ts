// import { IncomingHttpHeaders } from 'http2';
// import { headers } from 'next/headers';
// import { NextResponse } from 'next/server';
// import { Webhook, WebhookRequiredHeaders } from 'svix'; 
// import { db } from '@/lib/db'; 

// const svixSecret = process.env.SVIX_SECRET!;

// type EventType = "user.created" | "user.updated" | "*";

// type EmailAddress = {
//   created_at: number;
//   email_address: string;
//   id: string;
// };

// type Event = {
//   data: {
//     id: string;  
//     email_addresses: EmailAddress[];
//     [key: string]: any; 
//   };
//   object: "event";
//   type: EventType;
// };

// export async function POST(req: Request) {
//   console.log("Webhook received");

//   // Retrieve payload and headers
//   const payload = await req.json();
//   const headersList = headers();

//   const heads: IncomingHttpHeaders & WebhookRequiredHeaders = {
//     'svix-id': headersList.get('svix-id') ?? "",
//     'svix-timestamp': headersList.get('svix-timestamp') ?? "",
//     'svix-signature': headersList.get('svix-signature') ?? ""
//   };

//   if (!svixSecret) {
//     console.error("Svix secret is not set");
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }

//   const wh = new Webhook(svixSecret);

//   let evt: Event | null = null;
//   try {
//     evt = wh.verify(JSON.stringify(payload), heads) as Event;
//   } catch (err) {
//     console.log("Webhook verification error:", err);
//     return NextResponse.json({}, { status: 400 });
//   }

//   const eventType: EventType = evt?.type; 
//   const { id, email_addresses } = evt.data;  
//   const email = email_addresses[0]?.email_address;    

//   if (!email) {
//     console.error("No email address found in the event");
//     return NextResponse.json({ message: 'Invalid event data' }, { status: 400 });
//   }

//   try {
//     if (eventType === "user.created") {
//       await db.user.create({
//         data: {
//           externalId: id as string,
//           email: email as string,
//         },
//       });
//     } else if (eventType === "user.updated") {
//       const userToUpdate = await db.user.findUnique({
//         where: { externalId: id as string },
//       });

//       if (userToUpdate) {
//         if (userToUpdate.email !== email) {
//           await db.user.update({
//             where: { externalId: id as string },
//             data: { email: email as string },  
//           });
//         }
//       } else {
//         console.error("User not found for update");
//         return NextResponse.json({ message: 'User not found' }, { status: 404 });
//       }
//     }
//   } catch (error) {
  
    
//     console.error("Error during database operation:", error);
//     return NextResponse.json({ message: 'Database error' }, { status: 500 });
//   }

//   return NextResponse.json({ message: 'Event processed' }, { status: 200 });
// }  
