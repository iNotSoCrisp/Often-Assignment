"use client";
import { useState, useEffect } from "react";
// Remove direct import of html2pdf
// import html2pdf from "html2pdf.js";

export default function ExportButtons({ elements, theme }) {
  const [generating, setGenerating] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [html2pdfLoaded, setHtml2pdfLoaded] = useState(false);

  // Dynamically import html2pdf on client side only
  useEffect(() => {
    let isMounted = true;
    const loadHtml2pdf = async () => {
      try {
        // Use dynamic import with window check for Vercel compatibility
        if (typeof window !== 'undefined') {
          await import('html2pdf.js/dist/html2pdf.bundle.min.js');
          if (isMounted) setHtml2pdfLoaded(true);
        }
      } catch (err) {
        console.error("Error loading html2pdf:", err);
      }
    };

    loadHtml2pdf();

    return () => {
      isMounted = false;
    };
  }, []);

  // Export as PDF
  const handleExportPdf = async () => {
    if (!html2pdfLoaded) return;

    try {
      // Import html2pdf only when needed
      const html2pdfModule = await import('html2pdf.js/dist/html2pdf.bundle.min.js');
      const html2pdf = html2pdfModule.default;

      // First get the container with the actual content
      const canvas = document.querySelector('[class*="absolute inset-0 border rounded-lg"]');
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }

      // Set a background color to ensure content is visible
      const originalStyle = canvas.getAttribute('style') || '';
      canvas.setAttribute('style', `${originalStyle}; background-color: ${theme === 'dark' ? '#1a202c' : '#ffffff'};`);

      // Create a temporary div to hold our content for the PDF
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '1100px'; // Fixed width for PDF generation
      tempDiv.style.height = '800px'; // Fixed height
      tempDiv.style.position = 'relative';
      tempDiv.style.backgroundColor = theme === 'dark' ? '#1a202c' : '#ffffff';
      tempDiv.style.padding = '20px';

      // Clone the canvas content
      const contentClone = canvas.cloneNode(true);

      // Remove any delete buttons, Moveable controls and select handles
      const deleteButtons = contentClone.querySelectorAll('button');
      deleteButtons.forEach(btn => btn.remove());

      const moveableControls = contentClone.querySelectorAll('[class*="moveable"]');
      moveableControls.forEach(control => control.remove());

      const selectHandles = contentClone.querySelectorAll('[data-direction]');
      selectHandles.forEach(handle => handle.remove());

      // Append the clone to our temp div
      tempDiv.appendChild(contentClone);

      // Add temporary div to document for html2pdf to process
      document.body.appendChild(tempDiv);
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';

      // Set options for PDF
      const options = {
        margin: 10,
        filename: 'TravelStory.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
          allowTaint: true,
          foreignObjectRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

      // Generate PDF
      await html2pdf()
        .from(tempDiv)
        .set(options)
        .save()
        .then(() => {
          // Clean up
          canvas.setAttribute('style', originalStyle);
          document.body.removeChild(tempDiv);
        })
        .catch(error => {
          console.error("Error generating PDF:", error);
          // Clean up
          canvas.setAttribute('style', originalStyle);
          document.body.removeChild(tempDiv);
        });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
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
      if (videoButtonContainer) {
        videoButtonContainer.appendChild(videoLink);
      }
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
        disabled={!html2pdfLoaded}
      >
        Export as PDF
      </button>
    </div>
  );
}