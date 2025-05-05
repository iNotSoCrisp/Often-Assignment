"use client";
import { useState, useEffect } from "react";

export default function ExportButtons({ elements, theme }) {
  const [generating, setGenerating] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Dynamically import libraries on client side only
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        if (typeof window !== 'undefined') {
          await Promise.all([
            import('dom-to-image-more'),
            import('jspdf')
          ]);
          setLibrariesLoaded(true);
        }
      } catch (err) {
        console.error("Error loading libraries:", err);
      }
    };

    loadLibraries();
  }, []);

  // Export as PDF
  const handleExportPdf = async () => {
    if (!librariesLoaded || generatingPdf) return;

    setGeneratingPdf(true);

    try {
      // Dynamic imports
      const domtoimage = (await import('dom-to-image-more')).default;
      const { jsPDF } = await import('jspdf');

      // Get canvas element
      const canvas = document.querySelector('[class*="absolute inset-0 border rounded-lg"]');
      if (!canvas) {
        throw new Error("Canvas element not found");
      }

      // Store original styling and content
      const elementsToHide = Array.from(canvas.querySelectorAll('button'));
      const moveableElements = Array.from(document.querySelectorAll('[class*="moveable"]'));

      // Store original display values
      const originalButtonDisplay = elementsToHide.map(el => el.style.display);
      const originalMoveableDisplay = moveableElements.map(el => el.style.display);

      // Hide elements
      elementsToHide.forEach(el => el.style.display = 'none');
      moveableElements.forEach(el => el.style.display = 'none');

      // Create notification
      const notification = document.createElement('div');
      notification.textContent = 'Creating PDF...';
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.padding = '10px 20px';
      notification.style.backgroundColor = 'black';
      notification.style.color = 'white';
      notification.style.borderRadius = '4px';
      notification.style.zIndex = '9999';
      document.body.appendChild(notification);

      try {
        // Capture the canvas as a PNG image with high quality
        const dataUrl = await domtoimage.toPng(canvas, {
          quality: 1.0,
          bgcolor: theme === 'dark' ? '#1a202c' : '#ffffff',
          height: canvas.offsetHeight,
          width: canvas.offsetWidth,
          style: {
            'transform': 'none',
            'transform-origin': 'none'
          }
        });

        // Create a PDF document
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        // Get PDF dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate image dimensions with margins
        const margin = 10; // 10mm margin
        const imgWidth = pdfWidth - (margin * 2);
        const imgHeight = (canvas.offsetHeight * imgWidth) / canvas.offsetWidth;

        // If image is too tall, scale it down
        const finalImgHeight = Math.min(imgHeight, pdfHeight - (margin * 2));
        const finalImgWidth = imgHeight > pdfHeight - (margin * 2)
          ? (canvas.offsetWidth * finalImgHeight) / canvas.offsetHeight
          : imgWidth;

        // Center the image on the page
        const x = (pdfWidth - finalImgWidth) / 2;
        const y = (pdfHeight - finalImgHeight) / 2;

        // Add the image to the PDF
        pdf.addImage(dataUrl, 'PNG', x, y, finalImgWidth, finalImgHeight);

        // Save the PDF
        pdf.save('TravelStory.pdf');
      } finally {
        // Restore original display values
        elementsToHide.forEach((el, i) => {
          el.style.display = originalButtonDisplay[i] || '';
        });

        moveableElements.forEach((el, i) => {
          el.style.display = originalMoveableDisplay[i] || '';
        });

        // Remove notification
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error creating the PDF. Please try again.");
    } finally {
      setGeneratingPdf(false);
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
        disabled={!librariesLoaded || generatingPdf}
      >
        {generatingPdf ? 'Generating...' : 'Export as PDF'}
      </button>
    </div>
  );
}