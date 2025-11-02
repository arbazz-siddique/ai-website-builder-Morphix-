'use client'
import { Button } from '@/components/ui/button'
import { SignInButton, useUser } from '@clerk/nextjs'
import axios from 'axios'
import { ArrowUp, HomeIcon, ImagePlus, Key, LayoutDashboard, LoaderCircle, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import {v4 as uuidv4} from 'uuid'

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
    const {user} = useUser()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const CreateNewProject = async()=>{
        setLoading(true)
        const projectId = uuidv4()
        const frameId = generateRandomFrameNumber()
        const messages =[
            {
                role:'user',
                content:userInput
            }
        ]
        try {
            const result = await axios.post('/api/projects',{
                projectId:projectId,
                frameId:frameId,
                messages:messages
            })
            console.log(result.data)
            toast.success("project created")
            // navigate to playground
            router.push(`/playground/${projectId}?frameId=${frameId}`)

            setLoading(false)

        } catch (error) {
            toast.error("Internal server error")
            console.log(error)
            setLoading(false)
        }
    }
    
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
                {!user ? <SignInButton mode='modal' fallbackRedirectUrl={'/workspace'}>
                <Button disabled={!userInput} size={'icon'}> <ArrowUp/> </Button>
                </SignInButton>
                :
                <Button 
                disabled={!userInput || loading}
                 size={'icon'}
                 onClick={CreateNewProject}
                 > {loading ? <LoaderCircle className='animate-spin'/> : <ArrowUp/>} </Button>
            }
                
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

const generateRandomFrameNumber = ()=>{
    const num = Math.floor(Math.random() * 10000)
    return num
}
