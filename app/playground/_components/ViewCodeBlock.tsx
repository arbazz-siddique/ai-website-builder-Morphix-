import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

function ViewCodeBlock({children, code}:any) {
    const handleCopy = async()=>{
        await navigator.clipboard.writeText(code)
        toast.success("Copied ✔️" )
    }
  return (
    <Dialog>
  <DialogTrigger>{children}</DialogTrigger>
  <DialogContent className='min-w-7xl max-h-[650px] overflow-auto'>
    <DialogHeader>
      <DialogTitle> <div className='flex gap-5 items-center'>Source Code <Button className='hover:bg-blue-300 cursor-pointer' variant={'ghost'} onClick={handleCopy}> <Copy/> </Button> </div> </DialogTitle>
      <DialogDescription>
        <div>
            <SyntaxHighlighter>
                {code}
            </SyntaxHighlighter>
        </div>
        
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default ViewCodeBlock