"use client"

import { useEffect, useState } from "react"
import type { CarState } from "@/lib/game-store"
import { Star } from "lucide-react"

interface PlayerHudProps {
  store: CarState
  collected: number
  total: number
  label: string
  accent: string
}

export function PlayerHud({ store, collected, total, label, accent }: PlayerHudProps) {
  const [speed, setSpeed] = useState(0)
  const [air, setAir] = useState(false)

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

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Player label + stars */}
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-2xl bg-black/40 px-3 py-1.5 text-white backdrop-blur-md">
        <span
          className="rounded-lg px-2 py-0.5 text-sm font-black text-white shadow"
          style={{ background: accent }}
        >
          {label}
        </span>
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <span className="text-xl font-black tabular-nums">{collected}</span>
        <span className="text-xs font-medium text-white/60">/ {total}</span>
      </div>

      {/* Speedometer */}
      <div className="absolute bottom-3 right-3 flex flex-col items-end">
        <div className="rounded-2xl bg-black/40 px-3 py-1.5 text-right text-white backdrop-blur-md">
          <span className="text-3xl font-black tabular-nums">{speed}</span>
          <span className="ml-1 text-xs font-medium text-white/60">km/h</span>
        </div>
        {air && (
          <div className="mt-1.5 animate-pulse rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-black text-black">
            AIRBORNE!
          </div>
        )}
      </div>
    </div>
  )
}
