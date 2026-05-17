'use client'

import { useCallback, useEffect, useRef } from 'react'

let sharedContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!sharedContext) {
    sharedContext = new AudioContext()
  }
  return sharedContext
}

export function useSound(src: string) {
  const bufferRef = useRef<AudioBuffer | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let cancelled = false

    async function load() {
      const ctx = getAudioContext()
      if (!ctx) return

      try {
        const res = await fetch(src)
        const arrayBuffer = await res.arrayBuffer()
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
        if (!cancelled) bufferRef.current = audioBuffer
      } catch {
        // sound file not found or decode failed — silent fail
      }
    }

    load()
    return () => { cancelled = true }
  }, [src])

  const play = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx || !bufferRef.current) return

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') ctx.resume()

    const source = ctx.createBufferSource()
    source.buffer = bufferRef.current
    source.connect(ctx.destination)
    source.start(0)
  }, [])

  return { play }
}
