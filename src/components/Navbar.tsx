import React from 'react'
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'
import { BsFiletypePdf } from "react-icons/bs";
const Navbar = () => {
  return (
 
      <Menubar className=' h-14  fixed top-0 left-0 z-50 w-full  bg-zinc-50 dark:bg-zinc-800'>
  <MenubarMenu>
 <div className=' container flex items-center mx-auto justify-between w-full'>
  <Link href={"/"} className=' px-2  text-nowrap flex items-end   font-semibold '>   CHAT<span className=' text-blue-500'>DOC.</span>    </Link>
 <div className=' flex items-center gap-4'>
    <MenubarTrigger>
       pricing
    </MenubarTrigger>
 <MenubarTrigger>
      Sign-in 
    </MenubarTrigger>
    <MenubarTrigger>
        Get Started
    </MenubarTrigger>
 <MenubarTrigger>  
    <UserButton/>
 </MenubarTrigger>
 </div>
 </div>
  </MenubarMenu>
</Menubar>

 
  )
}

export default Navbar
