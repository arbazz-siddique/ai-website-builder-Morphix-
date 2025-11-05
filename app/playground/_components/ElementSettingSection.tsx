import React, { useEffect, useState } from "react";
import { SwatchBook, Trash2, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Props = {
  selectedEl?: HTMLElement | null;
  clearSelection: () => void;
};

function clampNumber(value: number, min = 0, max = 200) {
  return Math.max(min, Math.min(max, value));
}

export default function ElementSettingSection({ selectedEl, clearSelection }: Props) {
  // local editable copies of styles / classes
  const [fontSize, setFontSize] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("");
  const [borderRadius, setBorderRadius] = useState<number>(8);
  const [paddingAll, setPaddingAll] = useState<number>(12);
  const [marginAll, setMarginAll] = useState<number>(0);
  const [classes, setClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState<string>("");

  // sync from selectedEl whenever it changes
  useEffect(() => {
    if (!selectedEl) {
      // reset UI
      setFontSize("");
      setTextColor("#000000");
      setBgColor("");
      setBorderRadius(8);
      setPaddingAll(12);
      setMarginAll(0);
      setClasses([]);
      setNewClass("");
      return;
    }

    const computed = window.getComputedStyle(selectedEl);

    // inline style fallback -> computed style
    setFontSize(
      selectedEl.style.fontSize ||
        (computed.fontSize ? computed.fontSize : "")
    );

    // text color - try inline first then computed
    const inlineColor = selectedEl.style.color;
    setTextColor(inlineColor || rgbToHex(computed.color) || "#000000");

    const inlineBg = selectedEl.style.backgroundColor;
    setBgColor(inlineBg || rgbToHex(computed.backgroundColor) || "");

    const inlineRadius = parseInt(
      (selectedEl.style.borderRadius || "").replace("px", "") || "0",
      10
    );
    setBorderRadius(isNaN(inlineRadius) ? 8 : inlineRadius);

    const inlinePadding = parseInt(
      (selectedEl.style.padding || "").replace("px", "") || "0",
      10
    );
    setPaddingAll(isNaN(inlinePadding) ? 12 : inlinePadding);

    const inlineMargin = parseInt(
      (selectedEl.style.margin || "").replace("px", "") || "0",
      10
    );
    setMarginAll(isNaN(inlineMargin) ? 0 : inlineMargin);

    // classes
    setClasses(Array.from(selectedEl.classList || []));
  }, [selectedEl]);

  // helper to set inline style on the selected element
  const applyStyle = (prop: string, value: string) => {
    if (!selectedEl) return;
    // @ts-ignore
    selectedEl.style[prop] = value;
    // keep UI in sync
    if (prop === "fontSize") setFontSize(value);
    if (prop === "color") setTextColor(value);
    if (prop === "backgroundColor") setBgColor(value);
    if (prop === "borderRadius") setBorderRadius(parseInt(value, 10) || 0);
    if (prop === "padding") setPaddingAll(parseInt(value.replace("px", "")) || 0);
    if (prop === "margin") setMarginAll(parseInt(value.replace("px", "")) || 0);
  };

  // class management
  const addClass = () => {
    if (!selectedEl) return;
    const trimmed = newClass.trim();
    if (!trimmed) return;
    selectedEl.classList.add(trimmed);
    setClasses(Array.from(selectedEl.classList));
    setNewClass("");
  };

  const removeClass = (cls: string) => {
    if (!selectedEl) return;
    selectedEl.classList.remove(cls);
    setClasses(Array.from(selectedEl.classList));
  };

  const clearInlineStyles = () => {
    if (!selectedEl) return;
    selectedEl.removeAttribute("style");
    // refresh UI
    setFontSize("");
    setTextColor("#000000");
    setBgColor("");
    setBorderRadius(8);
    setPaddingAll(12);
    setMarginAll(0);
  };

  const resetClasses = () => {
    if (!selectedEl) return;
    selectedEl.className = "";
    setClasses([]);
  };

  // small util: convert rgb(...) to hex
  function rgbToHex(rgb: string) {
    if (!rgb || rgb === "transparent") return "";
    const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return "";
    const r = parseInt(m[1], 10);
    const g = parseInt(m[2], 10);
    const b = parseInt(m[3], 10);
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const s = x.toString(16);
          return s.length === 1 ? "0" + s : s;
        })
        .join("")
    );
  }

  return (
    <div className="p-4 w-96 shadow space-y-4 bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="flex gap-2 items-center font-semibold text-sm">
          <SwatchBook /> Element Settings
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={clearInlineStyles} title="Clear inline styles">
            Reset styles
          </Button>
          <Button variant="ghost" onClick={resetClasses} title="Remove all classes">
            <Trash2 />
          </Button>
          <Button variant="ghost" onClick={clearSelection} title="Unselect">
            <X />
          </Button>
        </div>
      </div>

      {/* Font size */}
      <div>
        <label className="block text-xs font-medium mb-1">Font size</label>
        <div className="flex gap-2 items-center">
          <Select
            defaultValue={fontSize || "16px"}
            onValueChange={(val) => applyStyle("fontSize", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={fontSize || "Select size"} />
            </SelectTrigger>
            <SelectContent>
              {[...Array(25)].map((_, i) => {
                const size = 12 + i;
                return <SelectItem key={size} value={`${size}px`}>{`${size}px`}</SelectItem>;
              })}
            </SelectContent>
          </Select>
          <input
            type="text"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            onBlur={() => applyStyle("fontSize", fontSize || "")}
            className="w-20 px-2 py-1 border rounded text-sm"
            placeholder="e.g. 18px"
          />
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium mb-1">Text color</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => {
              setTextColor(e.target.value);
              applyStyle("color", e.target.value);
            }}
            className="w-12 h-9 p-0 rounded"
            title="Text color"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Background</label>
          <input
            type="color"
            value={bgColor || "#ffffff"}
            onChange={(e) => {
              setBgColor(e.target.value);
              applyStyle("backgroundColor", e.target.value);
            }}
            className="w-12 h-9 p-0 rounded"
            title="Background color"
          />
        </div>
      </div>

      {/* Border radius */}
      <div>
        <label className="block text-xs font-medium mb-1">Border radius (px)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={borderRadius}
            onChange={(e) => {
              const v = clampNumber(parseInt(e.target.value, 10), 0, 200);
              setBorderRadius(v);
              applyStyle("borderRadius", `${v}px`);
            }}
            className="flex-1"
          />
          <input
            type="number"
            value={borderRadius}
            onChange={(e) => {
              const v = clampNumber(parseInt(e.target.value || "0", 10), 0, 200);
              setBorderRadius(v);
              applyStyle("borderRadius", `${v}px`);
            }}
            className="w-20 px-2 py-1 border rounded"
          />
        </div>
      </div>

      {/* Padding & Margin - simple all-sides controls */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium mb-1">Padding (px)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={paddingAll}
              onChange={(e) => {
                const v = clampNumber(parseInt(e.target.value || "0", 10), 0, 500);
                setPaddingAll(v);
                applyStyle("padding", `${v}px`);
              }}
              className="w-20 px-2 py-1 border rounded"
            />
            <div className="text-xs text-gray-500">applies to all sides</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Margin (px)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={marginAll}
              onChange={(e) => {
                const v = clampNumber(parseInt(e.target.value || "0", 10), -200, 500);
                setMarginAll(v);
                applyStyle("margin", `${v}px`);
              }}
              className="w-20 px-2 py-1 border rounded"
            />
            <div className="text-xs text-gray-500">all sides</div>
          </div>
        </div>
      </div>

      {/* Classes management */}
      <div>
        <label className="block text-xs font-medium mb-2">Tailwind classes</label>

        <div className="flex gap-2 items-center mb-2">
          <input
            placeholder="e.g. p-4 text-center bg-blue-500"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addClass();
              }
            }}
          />
          <Button onClick={addClass} title="Add class">
            <Plus />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {classes.length === 0 && (
            <div className="text-xs text-gray-500">No classes applied</div>
          )}
          {classes.map((c) => (
            <div key={c} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-sm">
              <span className="select-all">{c}</span>
              <button
                onClick={() => removeClass(c)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title={`Remove ${c}`}
                aria-label={`Remove class ${c}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* quick actions */}
      <div className="flex gap-2">
        <Button onClick={() => {
          // quick visual tweak example: toggle highlight
          if (!selectedEl) return;
          const highlight = "ring-4 ring-blue-300";
          if (selectedEl.classList.contains("ring-4")) {
            // remove any ring classes simply
            selectedEl.classList.remove("ring-4", "ring-blue-300");
          } else {
            selectedEl.classList.add("ring-4", "ring-blue-300");
          }
          setClasses(Array.from(selectedEl.classList));
        }}>
          Toggle highlight
        </Button>
        <Button onClick={() => {
          clearInlineStyles();
          resetClasses();
        }}>
          Clear all
        </Button>
      </div>
    </div>
  );
}
