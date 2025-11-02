'use client'
import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import { ArrowUp, HomeIcon, ImagePlus, Key, LayoutDashboard, User } from 'lucide-react'
import React, { useState } from 'react'

const suggestions = [
    {label:'Dashboard', 
        prompt:'create an analytics dashboard to track customers and revenue data for a SaaS', 
        icon:LayoutDashboard
    },
    {label:'SignUp Form', 
        prompt:'Create a modern sign up form with email/password fields, google and github login options and terms checkbox', 
        icon:Key
    },
    {label:'Hero', 
        prompt:'Create a modern header and centered hero section for a productivit SaaS, Include a badge for feature announcement, a title with a subtitle gradient effect', 
        icon:HomeIcon
    },
    {label:'User Profile Card', 
        prompt:'Create a modern user profile card component for a social media website.', 
        icon:User
    },
]

function Hero() {

    const [userInput, setUserInput] = useState<string>();
    
  return (
    <div className='flex flex-col items-center h-[80vh] justify-center'>
        {/* header and descripton */}
        <h2 className='font-bold text-5xl'>What should we Design today?</h2>
        <p className='mt-2 text-xl text-gray-500'>Generate,Edit and Explore design with AI. yeah Export code as well</p>
        {/* input box */}
        <div className='w-full max-w-2xl p-5 border mt-5 rounded-2xl'>
            <textarea placeholder='Describe your page desing and lets build together'
            className='w-full h-24 focus:outline-none focus:ring-0 resize-none'
            value={userInput}
            onChange={(event)=> setUserInput(event.target.value)}
            />
            <div className='flex justify-between items-center'>
                <Button variant={'ghost'} > <ImagePlus/> </Button>
                <SignInButton mode='modal' fallbackRedirectUrl={'/workspace'}>
                <Button disabled={!userInput} size={'icon'}> <ArrowUp/> </Button>
                </SignInButton>
            </div>
        </div>

        {/* suggestion list */}
        <div className='flex mt-4 gap-4'>
            {suggestions.map((suggestion, index)=>(
                <Button key={index} variant={'outline'}
                onClick={()=> setUserInput(suggestion.prompt)}
                >
                    <suggestion.icon/>
                    {suggestion.label}
                    </Button>
            ))}
        </div>
    </div>
  )
}

export default Hero