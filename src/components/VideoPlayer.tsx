'use client'

import { useRef, useState } from 'react'

interface VideoPlayerProps {
  embedUrl: string
  title: string
}

export default function VideoPlayer({ embedUrl, title }: VideoPlayerProps) {
  const [error, setError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  if (!embedUrl) {
    return (
      <div className="aspect-video rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
        <div className="text-center px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-zinc-400">
            <path d="M10.5 10.5 3 3" />
            <path d="M3 3l7.5 7.5" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <p className="text-zinc-500 dark:text-zinc-400">Video tidak tersedia</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="aspect-video rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
        <div className="text-center px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-red-400">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <p className="text-red-500 font-medium">Gagal memuat video</p>
          <button
            onClick={() => setError(false)}
            className="mt-2 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl relative">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allowFullScreen
        allow="autoplay; fullscreen"
        onError={() => setError(true)}
        sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
      />
    </div>
  )
}
