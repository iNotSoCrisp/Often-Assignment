"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import React from "react";

export default function DraggableImage({ id, src = "/placeholder.png", initial = { x: 100, y: 100 }, onDelete, selectedId, setSelectedId, ...props }) {
  const [target, setTarget] = useState(null);
  const [moveableComponent, setMoveableComponent] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) setTarget(node);
  }, []);
  const [frame, setFrame] = useState({
    translate: [initial.x, initial.y],
    width: 160,
    height: 160,
    rotate: 0,
  });

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
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image
          src={src}
          alt="Draggable"
          fill
          style={{ objectFit: 'cover' }}
          className="rounded shadow"
        />
      </div>
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