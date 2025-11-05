import { Button } from '@/components/ui/button'
import { Code2, Download, Monitor, SquareArrowUpRight, TabletSmartphone } from 'lucide-react'
import React, { useState } from 'react'
import ViewCodeBlock from './ViewCodeBlock'
import { toast } from 'sonner'

const htmlCode = `<!DOCTYPE html>
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

    <!-- Font Awesome / Lucide -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- AOS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <!-- Lottie -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

    <!-- Swiper -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

    <!-- Tippy.js -->
    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
  </head>
  <body id="root">
    {code}
  </body>
</html>`;

function WebPageTools({ selectedScreenSize, setSelectedScreenSize, generatedCode, getIframeHTML }: any) {
  const [finalCode, setFinalCode] = useState<string>("");

  // ✅ Core function to generate the up-to-date HTML (with edits from iframe)
  const generateFullHTML = () => {
    const liveCode = getIframeHTML ? getIframeHTML() : generatedCode;
    return htmlCode
      .replace("{code}", liveCode || "")
      .replaceAll("```html", "")
      .replaceAll("```", "")
      .replaceAll("html", "");
  };

  const viewInNewTab = () => {
    const fullHTML = generateFullHTML();
    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const downloadCode = () => {
    const fullHTML = generateFullHTML();
    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleViewCode = () => {
    setFinalCode(generateFullHTML());
  };

  return (
    <div className="p-2 shadow rounded-xl w-full flex items-center justify-between">
      {/* Device size switch */}
      <div className="flex gap-2">
        <Button
          variant={"ghost"}
          className={`${selectedScreenSize == "desktop" ? "border border-primary" : ""}`}
          onClick={() => setSelectedScreenSize("desktop")}
        >
          <Monitor />
        </Button>

        <Button
          variant={"ghost"}
          className={`${selectedScreenSize == "mobile" ? "border border-primary" : ""}`}
          onClick={() => setSelectedScreenSize("mobile")}
        >
          <TabletSmartphone />
        </Button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button variant={"outline"} onClick={viewInNewTab}>
          View <SquareArrowUpRight />
        </Button>

        <ViewCodeBlock code={finalCode}>
          <Button onClick={handleViewCode}>
            View <Code2 />
          </Button>
        </ViewCodeBlock>

        <Button onClick={downloadCode}>
          Download <Download />
        </Button>
      </div>
    </div>
  );
}

export default WebPageTools;
