import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'


const MenuOptions =[
    {
        name:"Pricing",
        path:"/pricing"
    },
     {
        name:"Contact Us",
        path:"/contact-us"
    }
]

function Header() {
  return (
    <div className='flex items-center justify-between p-4 shadow'>
        {/* logo */}
      <div className='flex gap-2 items-center'>
          <Image src={'/logo.svg'} alt='logo' width={35} height={35}/>
        <h2 className="text-2xl font-black ">Morphix</h2>
      </div>
        {/* Menu options */}

        <div className='flex gap-5'>
            {MenuOptions.map((menu, index)=>(
                <Button variant={'ghost'} key={index}>{menu.name}</Button>
            ))}
        </div>

        {/* get started button */}
        <div>
            <Button>Get Started <ArrowRight/> </Button>
        </div>
    </div>
  )
}

export default Header