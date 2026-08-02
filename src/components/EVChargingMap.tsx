import React, { useEffect, useRef, useState } from 'react';

interface EVChargingMapProps {
  className?: string;
  popupResponsive?: boolean;
}

const EVChargingMap: React.FC<EVChargingMapProps> = ({ className, popupResponsive }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure iframe content adjusts to dark/light mode
    const updateIframeTheme = () => {
      if (iframeRef.current) {
        const isDarkMode = document.documentElement.classList.contains('dark');
        iframeRef.current.contentWindow?.postMessage(
          { type: 'THEME_CHANGE', isDark: isDarkMode },
          '*'
        );
      }
    };

    // Initial theme setup
    updateIframeTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateIframeTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative w-full h-[60vw] max-h-[400px] md:h-[700px] md:max-h-[700px] overflow-x-auto overflow-y-auto rounded-lg overflow-hidden ${className} ${popupResponsive ? 'ev-popup-responsive' : ''}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-10">
          <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/EV_notebooks/ev_charging_map.html"
        className="absolute inset-0 w-full h-full border-0 min-w-full min-h-full"
        title="EV Charging Stations Map"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

/**
 * popupResponsive: If true, enables horizontal scrolling and constrains popup width for mobile popups.
 */

export default EVChargingMap; 