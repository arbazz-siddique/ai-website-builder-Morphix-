'use client';

import { Button } from '@/components/ui/button'
import { SignInButton, useUser } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const MenuOptions = [
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact-us" }
]

function Header() {
  const { user } = useUser();

  return (
    <header className="w-full shadow-sm bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-3 md:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={'/logo.svg'} alt='logo' width={35} height={35} className='rounded-full' />
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">Morphix</h2>
        </div>

        {/* Menu + Get Started Section */}
        <div className="flex items-center gap-4 mt-3 md:mt-0 flex-wrap justify-center md:justify-end w-full md:w-auto">
          
          {/* Menu options */}
          <nav className="flex gap-2 sm:gap-4 text-gray-700">
            {MenuOptions.map((menu, index) => (
              <Link key={index} href={menu.path}>
                <Button variant="ghost" className="text-sm sm:text-base">
                  {menu.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Get Started button */}
          {!user ? (
            <SignInButton mode="modal" forceRedirectUrl={'/workspace'}>
              <Button className="flex items-center gap-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </SignInButton>
          ) : (
            <Link href={'/workspace'}>
              <Button className="flex items-center gap-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition cursor-pointer">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header;
