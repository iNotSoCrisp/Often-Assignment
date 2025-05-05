"use client";
import { useRef, useState } from "react";
import ThemeSelector from "./ThemeSelector";

const STICKERS = ["🌴", "✈️", "🏔️", "🏖️", "🍜", "📸", "🗺️", "🏕️", "🏙️"];

export default function Toolbar({ onSave, onAddImage, onAddText, onAddSticker, theme, setTheme }) {
  const fileInput = useRef();
  const [showStickers, setShowStickers] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onAddImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex gap-4 items-center p-4 bg-gray-50 border-b shadow-sm z-10 relative">
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        className="hidden"
        onChange={handleFileChange}
      />
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => fileInput.current.click()}>
        Upload Image
      </button>
      <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={onAddText}>
        Add Text
      </button>
      <div className="relative">
        <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => setShowStickers((s) => !s)}>
          Stickers
        </button>
        {showStickers && (
          <div className="absolute left-0 mt-2 bg-white border rounded shadow p-2 flex gap-2 z-20">
            {STICKERS.map((emoji) => (
              <button
                key={emoji}
                className="text-2xl hover:scale-125 transition-transform"
                onClick={() => { onAddSticker(emoji); setShowStickers(false); }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      <ThemeSelector value={theme} onChange={setTheme} />
      <div className="flex-1" />
      <button className="px-6 py-2 bg-indigo-600 text-white rounded font-bold" onClick={onSave}>
        Save
      </button>
    </div>
  );
}