"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";

export default function DraggableText({ id, text = "Edit me!", initial = { x: 200, y: 200 }, onDelete, selectedId, setSelectedId, ...props }) {
  const [target, setTarget] = useState(null);
  const [moveableComponent, setMoveableComponent] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) setTarget(node);
  }, []);
  const editableRef = useRef();
  const [frame, setFrame] = useState({
    translate: [initial.x, initial.y],
    width: 160,
    height: 48,
    rotate: 0,
  });

  // Dynamically import Moveable on client side only
  useEffect(() => {
    import('react-moveable').then(module => {
      setMoveableComponent(() => module.default);
    });
  }, []);

  // Set initial content only once on mount
  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.textContent = text;
    }
    // eslint-disable-next-line
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
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        className="w-full h-full px-2 py-1 bg-white border rounded shadow text-lg font-semibold text-gray-800 focus:outline-none overflow-auto break-words"
        style={{
          wordBreak: "break-word",
          minWidth: 40,
          minHeight: 24,
          height: "100%",
          width: "100%",
          overflow: "auto",
          whiteSpace: "pre-wrap",
          boxSizing: "border-box",
        }}
        spellCheck={false}
      />
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