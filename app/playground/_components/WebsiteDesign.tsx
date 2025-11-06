import React, { useContext, useEffect, useRef, useState } from "react";
import WebPageTools from "./WebPageTools";
import ElementSettingSection from "./ElementSettingSection";
import ImageSettingSection from "./ImageSettingSection";
import { OnSaveContext } from "@/context/OnSaveContext";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useSearchParams } from "next/navigation";

type Props = {
  generatedCode: string;
};

const HTML_CODE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Morphix - Modern TailwindCSS + Flowbite Template">
    <title>Morphix</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Flowbite CSS & JS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body class="bg-gray-50 dark:bg-gray-900">
    <main id="root"></main>
  </body>
</html>
`;

function WebsiteDesign({ generatedCode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState("desktop");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>();
    const {onSaveData, setOnSaveData} = useContext(OnSaveContext)
     const { projectId } = useParams();
      const params = useSearchParams();
      const frameId = params.get("frameId");

  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // Write base HTML structure
    doc.open();
    doc.write(HTML_CODE);
    doc.close();

    const updateContent = () => {
      const root = doc.getElementById("root");
      if (root) {
        root.innerHTML =
          generatedCode
            ?.replaceAll("```html", "")
            .replaceAll("```", "")
            .replace("html", "") ?? "";
      }

      attachListeners();
    };

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const attachListeners = () => {
      const main = doc.querySelector("main");
      if (!main) return;

      const handleMouseOver = (e: MouseEvent) => {
        if (selectedEl) return;
        const target = e.target as HTMLElement;
        if (hoverEl && hoverEl !== target) {
          hoverEl.style.outline = "";
        }
        hoverEl = target;
        hoverEl.style.outline = "2px dotted blue";
      };

      const handleMouseOut = () => {
        if (selectedEl) return;
        if (hoverEl) {
          hoverEl.style.outline = "";
          hoverEl = null;
        }
      };

      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLElement;

        if (selectedEl && selectedEl !== target) {
          selectedEl.style.outline = "";
          selectedEl.removeAttribute("contenteditable");
        }

        selectedEl = target;
        selectedEl.style.outline = "2px solid red";
        selectedEl.setAttribute("contenteditable", "true");
        selectedEl.focus();
        setSelectedElement(selectedEl);
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && selectedEl) {
          selectedEl.style.outline = "";
          selectedEl.removeAttribute("contenteditable");
          selectedEl = null;
          setSelectedElement(null);
        }
      };

      main.addEventListener("mouseover", handleMouseOver);
      main.addEventListener("mouseout", handleMouseOut);
      main.addEventListener("click", handleClick);
      doc.addEventListener("keydown", handleKeyDown);
    };

    updateContent();

    return () => {
      const main = doc.querySelector("main");
      if (main) main.replaceChildren(); // safely clear listeners
    };
  }, [generatedCode]);

  // re-render content when code updates
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const root = doc.getElementById("root");
    if (root) {
      root.innerHTML =
        generatedCode
          ?.replaceAll("```html", "")
          .replaceAll("```", "")
          .replace("html", "") ?? "";
    }
  }, [generatedCode]);

useEffect(()=>{
  onSaveData && onSavedCode()
},[onSaveData])

const onSavedCode = async()=>{
  if(iframeRef.current){
    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if(iframeDoc){
        const colneDoc = iframeDoc.documentElement.cloneNode(true) as HTMLElement
        const AllEls = colneDoc.querySelectorAll<HTMLElement>("*")
        AllEls.forEach((el)=>{
          el.style.outline='';
          el.style.cursor='';
        })
        const html = colneDoc.outerHTML;
        
      const result = await axios.put('/api/frames',{
      designCode:html,
      frameId:frameId,
      projectId:projectId
    })
   
    toast.success('Code Saved')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
const getIframeHTML = () => {
  if (!iframeRef.current) return "";
  const doc = iframeRef.current.contentDocument;
  if (!doc) return "";
  return doc.body.innerHTML; // Get the live edited content
};

  return (
    <div className="flex gap-2 w-full">
      <div className="p-5 w-full flex items-center flex-col">
        <iframe
          ref={iframeRef}
          className={`${
            selectedScreenSize === "desktop" ? "w-full" : "w-100"
          } h-[600px] border-2 rounded-xl`}
          sandbox="allow-scripts allow-same-origin"
        />
        <WebPageTools
          selectedScreenSize={selectedScreenSize}
          setSelectedScreenSize={(v: string) => setSelectedScreenSize(v)}
          generatedCode={generatedCode}
          getIframeHTML={getIframeHTML}
        />
      </div>

      {/* Settings panel */}
      {selectedElement?.tagName === "IMG" ? (
        <ImageSettingSection selectedEl={selectedElement  as HTMLImageElement} />
      ) : selectedElement ? (
        <ElementSettingSection
          selectedEl={selectedElement}
          clearSelection={() => setSelectedElement(null)}
        />
      ) : null}
    </div>
  );
}

export default WebsiteDesign;
