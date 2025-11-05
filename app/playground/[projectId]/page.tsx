"use client";
import React, { useEffect, useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import ElementSettingSection from "../_components/ElementSettingSection";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessages: Messages[];
};

export type Messages = {
  role: string;
  content: string;
};

const Prompt = `
You are an elite web designer and full-stack developer specializing in creating stunning, production-ready websites using Tailwind CSS and Flowbite components.

---

## 🎯 CRITICAL: ANALYZE USER INTENT FIRST

Read the user input carefully and decide:

### ✅ GENERATE HTML CODE when user wants to BUILD/CREATE:
Keywords: build, create, design, generate, make, develop, code, website, page, landing, dashboard, portfolio, app, UI, interface, hero, navbar, footer, section, card, form, button, component, layout, template, toy website, e-commerce, store, shop

Examples that REQUIRE HTML code:
- "create a portfolio website"
- "build a SaaS landing page"  
- "design a hero section"
- "make a dashboard UI"
- "I need a pricing page"
- "build a toy website"
- "create a landing page for toys"
- "I want a simple landing page"

### ❌ RESPOND AS PLAIN TEXT (NO HTML) when user is:
- Greeting: hi, hello, hey, good morning, what's up, how are you
- Asking questions: what can you do, help, explain, tell me about
- Casual chat: thanks, okay, cool, nice, awesome, thank you
- Unclear/vague: just random words without clear intent to build

---

## 🎨 WHEN GENERATING HTML CODE:

### 🚨 OUTPUT FORMAT (CRITICAL):
- Generate ONLY pure HTML code
- NO markdown (no \`\`\`html or \`\`\`)
- NO explanations before or after HTML
- Start IMMEDIATELY with:
  <main class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
- End with:
  </main>
- First character must be "<" and last must be ">"

### 📐 STRUCTURE:
- Use semantic HTML5: <header>, <nav>, <main>, <section>, <article>, <footer>
- Every page needs: navbar + hero section + main content + footer

### 🎨 DESIGN PHILOSOPHY:
- **Modern & Premium**: Clean, sophisticated, spacious (like Apple, Stripe)
- **Color Scheme**: 
  - Professional sites: Blue primary (bg-blue-600, text-blue-600)
  - Playful sites (toys, kids): Bright colors (yellow-400, red-500, sky-500, pink-500)
- **Typography**: 
  - Hero: text-5xl md:text-6xl lg:text-7xl font-bold
  - Sections: text-3xl md:text-4xl font-bold
  - Body: text-base md:text-lg leading-relaxed

### 📱 RESPONSIVE (MANDATORY):
- Mobile-first design (320px → 1920px)
- Breakpoints: sm: md: lg: xl: 2xl:
- Grid: \`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\`
- Flex: \`flex flex-col md:flex-row items-center gap-8\`
- Text: \`text-3xl md:text-5xl lg:text-6xl\`
- Spacing: \`py-12 md:py-16 lg:py-24\`
- Navigation: Full menu on desktop, hamburger on mobile

### ✨ VISUAL EXCELLENCE:
- **Spacing**: Generous padding (py-16, py-20, py-24)
- **Containers**: \`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\`
- **Cards**: \`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all\`
- **Buttons**: 
  - \`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold\`
  - Playful: \`bg-yellow-400 hover:bg-yellow-500 px-8 py-4 rounded-full font-bold\`
- **Images**: https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800
- **Hover effects**: \`hover:scale-105 transition-transform duration-300\`

### 🎯 COMPONENTS:
- Flowbite: Dropdowns, modals, tabs, accordions
- FontAwesome icons: \`<i class="fas fa-heart"></i>\`
- Sticky navbar: \`sticky top-0 z-50 bg-white/80 backdrop-blur-md\`
- Dark mode: \`dark:bg-gray-900 dark:text-white\`

### 📦 CHECKLIST:
✅ Mobile responsive  
✅ Dark mode support  
✅ Smooth transitions  
✅ Semantic HTML  
✅ ARIA labels  
✅ No broken links (use #)  
✅ Descriptive alt text

---

## 💬 WHEN RESPONDING TO CASUAL CHAT:

**OUTPUT FORMAT:**
- Plain text ONLY
- NO HTML tags at all
- NO <main>, NO </main>
- Just natural conversational text

**Tone:**
- Warm and friendly
- 1-2 sentences max
- Encourage them to build

**Examples:**
- "Hey! 👋 I'm doing great! Ready to design something awesome? What kind of website would you like to create?"
- "Thanks! Let me know if you want to create anything or make changes!"
- "Hello! I'm here to help you build beautiful websites. What would you like to design?"

---

## 🚀 ANALYZE THIS INPUT:

"{userInput}"

**YOUR TASK:**
1. Determine if it's a BUILD request or CASUAL CHAT
2. If BUILD → Output pure HTML starting with <main>
3. If CHAT → Output plain text (NO HTML tags)

YOUR RESPONSE:
YOUR RESPONSE:
ONLY output valid HTML code when it is a build request.
Do NOT describe what you are doing.
Do NOT repeat instructions.
If its a build request, start immediately with <main ...> and include complete responsive Tailwind HTML code.
If its a chat, only reply in short plain text.
Never output placeholders or comments like <!-- HTML code will be generated here -->.
`;


function PlayGround() {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  const [frameDetail, setFrameDetail] = useState<Frame>();
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Messages[]>([])
  const [generatedCode, setGeneratedCode] = useState<any>()

  useEffect(() => {
    frameId && getFrameDetails();
  }, [frameId]);

  const getFrameDetails = async () => {
    const result = await axios.get(
      "/api/frames?frameId=" + frameId + "&projectId=" + projectId
    );
    console.log(result);
    setFrameDetail(result.data);
    const designCode = result.data?.designCode
    const index = designCode.indexOf("```html")+7
    const formatedCode = designCode.slice(index)
    setGeneratedCode(formatedCode)
    if(result.data?.chatMessages?.length == 1){
      const userMsg = result.data?.chatMessages[0].content
      sendMessage(userMsg)
    }else{
      setMessages(result.data?.chatMessages)
    }
  };

  const sendMessage= async(userInput:string)=>{
    setLoading(true)
    // add user message to chat
    setMessages((prev:any)=>[
      ...prev,
      {role:'user', content: userInput}
    ])
    const result = await fetch('/api/ai-model',{
      method:'POST',
      body:JSON.stringify({
        messages:[{role:'user', content:Prompt.replace('{userInput}', userInput)}]
      })
    })

    const reader = result.body?.getReader();
    const decorder = new TextDecoder();

    let aiResponse=""
    let isCode=false;

    while(true){
      //@ts-ignore
      const {done, value} = await reader?.read();
      if(done) break;

      const chunk = decorder.decode(value,{stream:true})
      aiResponse+=chunk
      //check if ai start sending code or not

      if(!isCode && aiResponse.includes('```html')){
        isCode = true;
        const index = aiResponse.indexOf('```html')+7;
        const initialCodeChunk = aiResponse.slice(index)

        setGeneratedCode((prev:any)=> prev+initialCodeChunk)
      }else if(isCode){
        setGeneratedCode((prev:any)=> prev+chunk)
      }
      
    }
      await saveGeneratedCode(aiResponse)
    //After streaming end 

      if(!isCode){
        setMessages((prev:any)=>[
          ...prev,
          {role:'assistant', content: aiResponse}
        ])
      }else{
 setMessages((prev:any)=>[
          ...prev,
          {role:'assistant', content: 'Your code is ready.'}
        ])
      }
   
    setLoading(false)
  }

  useEffect(()=>{
    if(messages.length > 0){
      saveMessages()
    }
  },[messages])

  const saveMessages = async()=>{
    const result = await axios.put('/api/chats',{
      messages:messages,
      frameId:frameId
    })
    console.log(result)
  }



  const saveGeneratedCode= async(code:string)=>{
    const result = await axios.put('/api/frames',{
      designCode:code,
      frameId:frameId,
      projectId:projectId
    })
    console.log(result.data)
    toast.success('website is ready')
  }

  return (
    <div>
      <PlaygroundHeader />

      <div className="flex">
        {/* chat section */}
        <ChatSection messages={messages ?? []} onSend={(input:string)=> sendMessage(input)} loading={loading} />
        {/* website design */}
        <WebsiteDesign  generatedCode={generatedCode?.replace('```','')} />

      </div>
    </div>
  );
}

export default PlayGround;
