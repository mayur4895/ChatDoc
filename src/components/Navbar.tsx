'use client'
import React from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { UserButton, useAuth } from '@clerk/nextjs'; // Import useAuth to get user authentication status
import Link from 'next/link';
import { Button } from './ui/button';
import { BsFiletypePdf } from "react-icons/bs";

const Navbar = () => {
  const { isSignedIn } = useAuth();  
  return (
    <Menubar className='h-14 fixed top-0 left-0 z-50 w-full bg-zinc-50 dark:bg-zinc-800'>
      <MenubarMenu>
        <div className='container flex items-center mx-auto justify-between w-full'>
          <Link href={"/"} className='px-2 text-nowrap flex items-end font-semibold'>
            CHAT<span className='text-blue-500'>DOC.</span>
          </Link>
          <div className='flex items-center gap-4'>
            <MenubarTrigger>pricing</MenubarTrigger>
            <Link href="/">
                  <MenubarTrigger>
                     Home
                  </MenubarTrigger>
                </Link>
           
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <MenubarTrigger>
                    Dashboard
                  </MenubarTrigger>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <MenubarTrigger>
                    Sign-in
                  </MenubarTrigger>
                </Link>
                <Link href="/get-started">
                  <MenubarTrigger>
                    Get Started
                  </MenubarTrigger>
                </Link>
              </>
            )}
            
            <MenubarTrigger>
              <UserButton />
            </MenubarTrigger>
          </div>
        </div>
      </MenubarMenu>
    </Menubar>
  );
}

export default Navbar;
