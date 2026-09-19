// USE: Thin fixed progress bar at the very top of the page. Reads scroll
// position every animation frame (synced with Lenis's own rAF loop) rather
// than the native scroll event, and has no CSS transition — so it tracks
// scroll position with zero perceptible lag.

import { useEffect, useRef, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      frameRef.current = requestAnimationFrame(update);
    };
    frameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent">
      <div className="h-full bg-cyan-400" style={{ width: `${progress}%` }} />
    </div>
  );
}
