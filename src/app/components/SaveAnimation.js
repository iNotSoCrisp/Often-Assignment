"use client";
import { useEffect, useState } from "react";

export default function SaveAnimation({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [successOpacity, setSuccessOpacity] = useState(0);
  const [successTransform, setSuccessTransform] = useState('translateY(10px)');

  useEffect(() => {
    // Fade in the container
    setOpacity(1);

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Show success message
          setShowSuccess(true);

          // Animate success message
          setSuccessOpacity(1);
          setSuccessTransform('translateY(0)');

          // Wait a bit before onDone
          setTimeout(onDone, 1200);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center"
        style={{
          opacity,
          transition: 'opacity 0.5s ease-out'
        }}
      >
        <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-indigo-500"
            style={{
              width: `${progress}%`,
              transition: 'width 0.3s ease-out'
            }}
          />
        </div>

        {!showSuccess ? (
          <div className="text-xl font-semibold mb-2">Saving your travel story...</div>
        ) : (
          <div
            className="text-green-600 text-lg font-bold mt-2"
            style={{
              opacity: successOpacity,
              transform: successTransform,
              transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
            }}
          >
            Journal saved successfully!
          </div>
        )}
      </div>
    </div>
  );
}