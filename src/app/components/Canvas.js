"use client";

import DraggableImage from "./DraggableImage";
import DraggableText from "./DraggableText";
import Sticker from "./Sticker";

const THEME_BG = {
  default: "bg-white",
  beach: "bg-gradient-to-b from-blue-400 via-sky-200 to-amber-300",
  mountains: "bg-gradient-to-b from-gray-300 via-emerald-700 to-amber-700",
};

const THEME_STYLES = {
  default: {},
  beach: {
    backgroundImage: `
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800' preserveAspectRatio='none'%3E%3Cpath fill='%23FFDC9E' d='M0,800 L1200,800 L1200,400 C1000,450 800,380 600,400 C400,420 200,380 0,430 Z' /%3E%3Cpath fill='%2387CEEB' fill-opacity='0.3' d='M0,800 L1200,800 L1200,430 C1000,480 800,410 600,430 C400,450 200,410 0,460 L0,800 Z' /%3E%3Cpath fill='%2300BFFF' fill-opacity='0.2' d='M0,800 L1200,800 L1200,460 C1000,500 800,440 600,460 C400,480 200,440 0,490 L0,800 Z' /%3E%3C/svg%3E"),
      linear-gradient(0deg, rgba(255, 235, 205, 0.7) 0%, rgba(255, 235, 205, 0) 30%),
      radial-gradient(circle at 90% 20%, rgba(255, 255, 204, 0.9) 0%, transparent 35%)
    `,
    backgroundSize: "100% 100%, cover, cover",
    backgroundPosition: "bottom, center, top right",
    backgroundRepeat: "no-repeat"
  },
  mountains: {
    backgroundImage: `
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 300' preserveAspectRatio='none'%3E%3Cpath fill='%23416A33' fill-opacity='0.2' d='M0,292.36218L80,87.36218L191,186.36218L239,88.36218L280,56.36218L321,88.36218L359,136.36218L393,68.36218L432.5,76.36218L476,105.36218L500,126.36218L539,92.36218L576,56.36218L650,88.36218L695,135.36218L750,151.36218L798,97.36218L832,56.36218L895,77.36218L926.5,36.36218L983,151.36218L1000,204.36218L1000,300L0,300Z'/%3E%3Cpath fill='%235D4037' fill-opacity='0.15' d='M393,195.36218L268,159.36218L239,160.36218L171,183.36218L80,194.36218L0,201.36218L0,250.36218L393,250.36218Z'/%3E%3Cpath fill='%23795548' fill-opacity='0.15' d='M393,250.36218L358,217.36218L252,214.36218L237,221.36218L215,225.36218L159,221.36218L132,222.36218L88,236.36218L0,250.36218Z'/%3E%3C/svg%3E"),
      linear-gradient(180deg, transparent 70%, rgba(139, 69, 19, 0.2) 100%),
      radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 20%),
      linear-gradient(0deg, rgba(121, 85, 72, 0.3) 0%, rgba(121, 85, 72, 0) 30%)
    `,
    backgroundSize: "100% 100%, cover, cover, cover",
    backgroundPosition: "bottom, center, center, bottom",
    backgroundRepeat: "no-repeat, no-repeat, no-repeat, repeat-x",
  }
};

export default function Canvas({ elements = [], theme = "default", onDelete, selectedId, setSelectedId }) {
  return (
    <div
      className={`absolute inset-0 border rounded-lg shadow overflow-hidden ${THEME_BG[theme] || THEME_BG.default}`}
      style={THEME_STYLES[theme] || {}}
      onMouseDown={e => {
        if (e.target === e.currentTarget) setSelectedId(null);
      }}
    >
      {elements.map((el) => {
        if (el.type === "image") return <DraggableImage key={el.id} id={el.id} src={el.src} initial={el.initial} onDelete={onDelete} selectedId={selectedId} setSelectedId={setSelectedId} />;
        if (el.type === "text") return <DraggableText key={el.id} id={el.id} text={el.text} initial={el.initial} onDelete={onDelete} selectedId={selectedId} setSelectedId={setSelectedId} />;
        if (el.type === "sticker") return <Sticker key={el.id} id={el.id} emoji={el.emoji} initial={el.initial} onDelete={onDelete} selectedId={selectedId} setSelectedId={setSelectedId} />;
        return null;
      })}
    </div>
  );
}