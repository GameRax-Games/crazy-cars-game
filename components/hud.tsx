"use client"

import { useEffect, useRef, useState } from "react"
import { gameStore, type CarState } from "@/lib/game-store"
import { Star, RotateCcw, Home } from "lucide-react"
import type { TouchControls } from "@/components/car"

interface HudProps {
  collected: number
  total: number
  onReset: () => void
  onMenu: () => void
  touch: React.MutableRefObject<TouchControls>
  store?: CarState
}

export function Hud({ collected, total, onReset, onMenu, touch, store = gameStore }: HudProps) {
  const [speed, setSpeed] = useState(0)
  const [air, setAir] = useState(false)
  const speedRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      setSpeed(Math.round(store.speed * 3.6))
      setAir(store.airborne)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [store])

  const setKey = (key: keyof TouchControls, val: boolean) => {
    touch.current[key] = val
  }

  const btn =
    "flex items-center justify-center rounded-full bg-white/25 backdrop-blur-sm text-white text-2xl font-bold w-16 h-16 active:bg-white/50 select-none touch-none border border-white/40"

  return (
    <>
      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-black/40 px-4 py-2 text-white backdrop-blur-md">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          <span className="text-2xl font-black tabular-nums">{collected}</span>
          <span className="text-sm font-medium text-white/60">/ {total}</span>
        </div>

        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-2xl bg-black/40 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/60"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={onMenu}
            className="flex items-center gap-1 rounded-2xl bg-black/40 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/60"
          >
            <Home className="h-4 w-4" /> Menu
          </button>
        </div>
      </div>

      {/* Speedometer */}
      <div className="pointer-events-none absolute bottom-4 right-4 flex flex-col items-end">
        <div className="rounded-2xl bg-black/40 px-4 py-2 text-right text-white backdrop-blur-md">
          <span ref={speedRef} className="text-4xl font-black tabular-nums">
            {speed}
          </span>
          <span className="ml-1 text-sm font-medium text-white/60">km/h</span>
        </div>
        {air && (
          <div className="mt-2 animate-pulse rounded-full bg-yellow-400 px-3 py-1 text-sm font-black text-black">
            AIRBORNE!
          </div>
        )}
      </div>

      {/* Desktop hint */}
      <div className="pointer-events-none absolute bottom-4 left-4 hidden rounded-2xl bg-black/40 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md sm:block">
        <span className="font-bold text-white">WASD</span> / Arrows to drive ·{" "}
        <span className="font-bold text-white">Space</span> to brake · Hit ramps to fly!
      </div>

      {/* Mobile touch controls */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:hidden">
        <div className="flex flex-col items-center gap-2">
          <button
            className={btn}
            onPointerDown={() => setKey("forward", true)}
            onPointerUp={() => setKey("forward", false)}
            onPointerLeave={() => setKey("forward", false)}
            aria-label="Accelerate"
          >
            ▲
          </button>
          <button
            className={btn}
            onPointerDown={() => setKey("back", true)}
            onPointerUp={() => setKey("back", false)}
            onPointerLeave={() => setKey("back", false)}
            aria-label="Reverse"
          >
            ▼
          </button>
        </div>

        <div className="flex items-end gap-3">
          <button
            className={btn}
            onPointerDown={() => setKey("left", true)}
            onPointerUp={() => setKey("left", false)}
            onPointerLeave={() => setKey("left", false)}
            aria-label="Steer left"
          >
            ◀
          </button>
          <button
            className={`${btn} bg-red-500/40`}
            onPointerDown={() => setKey("brake", true)}
            onPointerUp={() => setKey("brake", false)}
            onPointerLeave={() => setKey("brake", false)}
            aria-label="Brake"
          >
            ⬛
          </button>
          <button
            className={btn}
            onPointerDown={() => setKey("right", true)}
            onPointerUp={() => setKey("right", false)}
            onPointerLeave={() => setKey("right", false)}
            aria-label="Steer right"
          >
            ▶
          </button>
        </div>
      </div>
    </>
  )
}
