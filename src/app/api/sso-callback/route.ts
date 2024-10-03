// // pages/api/sso-callback.ts

// import { NextApiRequest, NextApiResponse } from 'next';
// import { auth } from '@clerk/nextjs/server';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   try {
  
//     const { code } = req.query;

//     if (!code) {
//       return res.status(400).json({ message: 'Authorization code is missing' });
//     } 
//     const { userId } = auth();

//     if (!userId) {
//       return res.status(401).json({ message: 'Authentication failed' });
//     }

//     console.log(userId);
    
    

  
 
//   } catch (error) {
//     console.error('Error during SSO callback:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }
