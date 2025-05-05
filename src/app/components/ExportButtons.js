"use client";
import { useState, useEffect } from "react";
// Remove direct import of html2pdf
// import html2pdf from "html2pdf.js";

export default function ExportButtons({ elements, theme }) {
  const [generating, setGenerating] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [html2pdfLib, setHtml2pdfLib] = useState(null);

  // Dynamically import html2pdf on client side only
  useEffect(() => {
    import('html2pdf.js/dist/html2pdf.bundle.min.js').then(module => {
      setHtml2pdfLib(() => module.default);
    }).catch(err => {
      console.error("Error loading html2pdf:", err);
    });
  }, []);

  // Export as PDF
  const handleExportPdf = () => {
    if (!html2pdfLib) return;

    const canvas = document.querySelector('[class*="absolute inset-0 border rounded-lg"]');

    // Create a clone of the canvas to avoid modifying the original
    const canvasClone = canvas.cloneNode(true);

    // Remove any delete buttons and Moveable controls
    const deleteButtons = canvasClone.querySelectorAll('button');
    deleteButtons.forEach(btn => btn.remove());

    // Set options for PDF
    const options = {
      margin: 10,
      filename: 'TravelStory.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // Generate PDF
    html2pdfLib().from(canvasClone).set(options).save();
  };

  // Generate a travel video (simplified version without Remotion)
  const handleGenerateVideo = () => {
    setGenerating(true);

    // Simulate video generation
    setTimeout(() => {
      setGenerating(false);
      setVideoReady(true);

      // Create a simulated download link
      const videoLink = document.createElement('a');
      videoLink.href = '#'; // Simulated video link
      videoLink.download = 'TravelStory.mp4';
      videoLink.innerText = 'Download Travel Video';
      videoLink.className = 'text-blue-600 underline mt-2';
      videoLink.onclick = (e) => {
        e.preventDefault();
        alert('This is a simulation of video generation. In a real implementation, this would create an animated video of your travel journal using tools like Remotion.js');
      };

      // Find the video button container and append the link
      const videoButtonContainer = document.querySelector('#videoButtonContainer');
      videoButtonContainer.appendChild(videoLink);
    }, 3000);
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
      <div id="videoButtonContainer" className="flex flex-col items-end">
        <button
          className={`px-6 py-3 bg-pink-600 text-white rounded shadow-lg font-bold text-lg ${generating ? 'opacity-70' : ''}`}
          onClick={handleGenerateVideo}
          disabled={generating || videoReady}
        >
          {generating ? 'Generating...' : videoReady ? 'Video Generated!' : 'Generate Travel Video'}
        </button>
      </div>

      <button
        className="px-6 py-3 bg-green-600 text-white rounded shadow-lg font-bold text-lg"
        onClick={handleExportPdf}
        disabled={!html2pdfLib}
      >
        Export as PDF
      </button>
    </div>
  );
}