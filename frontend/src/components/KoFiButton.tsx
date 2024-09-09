'use client';
import { useEffect } from 'react';

// Extend the window object to include kofiWidgetOverlay
declare global {
    interface Window {
      kofiWidgetOverlay: {
        draw: (username: string, options: Record<string, string>) => void;
      };
    }
  }

export default function KoFiButton() {
    useEffect(() => {
        // Create a script element
        const script = document.createElement('script');
        script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
        script.async = true;
        
        // Append the script to the document
        document.body.appendChild(script);
    
        // Ensure the kofiWidgetOverlay is available after the script loads
        script.onload = () => {
          if (window.kofiWidgetOverlay) {
            window.kofiWidgetOverlay.draw('yuridagosto', {
              'type': 'floating-chat',
              'floating-chat.donateButton.text': 'Support me',
              'floating-chat.donateButton.background-color': '#fcbf47',
              'floating-chat.donateButton.text-color': '#323842',
            });
          }
        };
    
        // Cleanup script when component unmounts
        return () => {
          document.body.removeChild(script);
        };
    }, []);
    
    return null;
};
    