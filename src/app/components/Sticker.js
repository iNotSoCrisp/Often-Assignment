"use client";
import React, { useState, useCallback, useEffect } from "react";

export default function Sticker({ id, emoji = "🌴", initial = { x: 300, y: 300 }, onDelete, selectedId, setSelectedId }) {
  const [target, setTarget] = useState(null);
  const [moveableComponent, setMoveableComponent] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) setTarget(node);
  }, []);
  const [frame, setFrame] = useState({
    translate: [initial.x, initial.y],
    width: 48,
    height: 48,
    rotate: 0,
  });

  // Dynamically import Moveable on client side only
  useEffect(() => {
    import('react-moveable').then(module => {
      setMoveableComponent(() => module.default);
    });
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: frame.width,
        height: frame.height,
        transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`,
        zIndex: selectedId === id ? 20 : 1,
      }}
      onMouseDown={e => {
        e.stopPropagation();
        setSelectedId?.(id);
      }}
    >
      <button
        onClick={() => onDelete?.(id)}
        className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        style={{ cursor: "pointer" }}
        tabIndex={-1}
      >×</button>
      <span className="text-4xl select-none cursor-pointer w-full h-full flex items-center justify-center" style={{ fontSize: '2.5rem', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{emoji}</span>
      {target && selectedId === id && moveableComponent && (
        React.createElement(moveableComponent, {
          target: target,
          draggable: true,
          resizable: true,
          rotatable: true,
          onDrag: ({ beforeTranslate }) => setFrame(f => ({ ...f, translate: beforeTranslate })),
          onResize: ({ width, height, drag }) => setFrame(f => ({
            ...f,
            width,
            height,
            translate: drag.beforeTranslate,
          })),
          onRotate: ({ beforeRotate }) => setFrame(f => ({ ...f, rotate: beforeRotate })),
        })
      )}
    </div>
  );
}