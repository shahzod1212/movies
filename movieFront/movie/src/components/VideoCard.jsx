import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

let youtubeApiPromise = null;

function loadYoutubeApi() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }
  youtubeApiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousCallback) previousCallback();
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);
  });
  return youtubeApiPromise;
}

export default function VideoCard({ videoId }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadYoutubeApi().then((YT) => {
      if (cancelled || !containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: (event) => {
            setIsPlaying(event.data === YT.PlayerState.PLAYING);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
    };
  }, [videoId]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <p className="text-xs uppercase tracking-widest text-stone-500">
            Loading trailer…
          </p>
        </div>
      )}

      {isReady && (
        <button
          onClick={togglePlay}
          className="group absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/20"
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/30 transition-opacity ${
              isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-stone-50 text-stone-50" />
            ) : (
              <Play className="ml-1 h-6 w-6 fill-stone-50 text-stone-50" />
            )}
          </span>
        </button>
      )}
    </div>
  );
}
