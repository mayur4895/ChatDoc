import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
 
import { Webhook } from 'svix'; 
type UserPayload = {
    type: 'user.created' | 'user.updated';
    data: {
      id: string;
      email_addresses: Array<{
        email_address: string;
      }>;
    };
  };
  
 
const svixSecret = process.env.SVIX_SECRET!;

export async function POST(req: NextRequest) {
  try {
  
    const svixHeaders = {
      'svix-id': req.headers.get('svix-id') ?? '',
      'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
      'svix-signature': req.headers.get('svix-signature') ?? '',
    };

    if (!svixSecret) {
      console.error("Svix secret is not set");
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }

 
    const body = await req.json();

    let verifiedPayload: UserPayload;
    try {
 
      const webhook = new Webhook(svixSecret);
      verifiedPayload = webhook.verify(JSON.stringify(body), svixHeaders) as UserPayload;
    } catch (err) {
      console.error('Invalid Svix webhook signature:', err);
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

 
    if (verifiedPayload.type === 'user.created' || verifiedPayload.type === 'user.updated') {
      const user = verifiedPayload.data;

 
      await db.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email_addresses[0].email_address,
        },
        create: {
          id: user.id,
          email: user.email_addresses[0].email_address,
        },
      });
    }

    return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
