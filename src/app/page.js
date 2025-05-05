"use client";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import SaveAnimation from "./components/SaveAnimation";
import ExportButtons from "./components/ExportButtons";
import { useState } from "react";

export default function Home() {
  const [showSaveAnim, setShowSaveAnim] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [elements, setElements] = useState([]); // {type, ...props}
  const [theme, setTheme] = useState("default");
  const [selectedId, setSelectedId] = useState(null);

  // Add image
  const handleAddImage = (src) => {
    setElements((els) => [
      ...els,
      { type: "image", src, id: Date.now() + Math.random(), initial: { x: 100, y: 100 } },
    ]);
  };
  // Add text
  const handleAddText = () => {
    setElements((els) => [
      ...els,
      { type: "text", text: "Edit me!", id: Date.now() + Math.random(), initial: { x: 200, y: 200 } },
    ]);
  };
  // Add sticker
  const handleAddSticker = (emoji) => {
    setElements((els) => [
      ...els,
      { type: "sticker", emoji, id: Date.now() + Math.random(), initial: { x: 300, y: 300 } },
    ]);
  };
  // Delete element
  const handleDelete = (id) => setElements(els => els.filter(el => el.id !== id));

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <Toolbar
        onSave={() => setShowSaveAnim(true)}
        onAddImage={handleAddImage}
        onAddText={handleAddText}
        onAddSticker={handleAddSticker}
        theme={theme}
        setTheme={setTheme}
      />
      <div className="flex-1 relative overflow-hidden">
        <Canvas elements={elements} theme={theme} onDelete={handleDelete} selectedId={selectedId} setSelectedId={setSelectedId} />
        {showSaveAnim && (
          <SaveAnimation onDone={() => { setShowSaveAnim(false); setShowExport(true); }} />
        )}
        {showExport && <ExportButtons elements={elements} theme={theme} />}
      </div>
    </div>
  );
}
