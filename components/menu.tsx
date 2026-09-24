"use client"

import { CARS, type CarConfig } from "@/lib/cars"
import { Star, Lock, Gauge, Zap } from "lucide-react"

interface MenuProps {
  bank: number
  selected: string
  onSelect: (id: string) => void
  onPlay: () => void
}

export function Menu({ bank, selected, onSelect, onPlay }: MenuProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-300 px-4 py-10">
      {/* decorative clouds */}
      <div className="pointer-events-none absolute left-10 top-16 h-16 w-40 rounded-full bg-white/70 blur-sm" />
      <div className="pointer-events-none absolute right-16 top-28 h-12 w-32 rounded-full bg-white/60 blur-sm" />
      <div className="pointer-events-none absolute left-1/3 top-8 h-10 w-24 rounded-full bg-white/50 blur-sm" />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="mb-2 text-center">
          <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:text-7xl">
            CRAZY CARS
          </h1>
          <p className="mt-2 text-lg font-semibold text-white/90 drop-shadow">
            Explore the open world · Hit ramps · Collect every star
          </p>
        </div>

        <div className="mb-4 flex items-center justify-center gap-2 text-white">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 drop-shadow" />
          <span className="text-2xl font-black tabular-nums drop-shadow">{bank}</span>
          <span className="font-medium text-white/80">stars banked</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CARS.map((car) => {
            const unlocked = bank >= car.price
            const isSelected = selected === car.id
            return (
              <button
                key={car.id}
                disabled={!unlocked}
                onClick={() => onSelect(car.id)}
                className={`group relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition ${
                  isSelected
                    ? "border-white bg-white/40 shadow-xl"
                    : "border-white/40 bg-white/20 hover:bg-white/30"
                } ${!unlocked ? "cursor-not-allowed opacity-70" : ""} backdrop-blur-md`}
              >
                <CarBadge color={car.body} accent={car.accent} />
                <span className="text-base font-black text-white drop-shadow">{car.name}</span>
                <div className="flex gap-3 text-xs font-semibold text-white/90">
                  <span className="flex items-center gap-0.5">
                    <Gauge className="h-3.5 w-3.5" /> {car.maxSpeed}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Zap className="h-3.5 w-3.5" /> {car.accel}
                  </span>
                </div>
                {!unlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl bg-black/45 backdrop-blur-[2px]">
                    <Lock className="h-6 w-6 text-white" />
                    <span className="flex items-center gap-1 text-sm font-black text-yellow-300">
                      <Star className="h-4 w-4 fill-yellow-300" /> {car.price}
                    </span>
                  </div>
                )}
                {isSelected && unlocked && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-black text-white shadow">
                    SELECTED
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onPlay}
            className="rounded-full bg-red-500 px-12 py-4 text-2xl font-black text-white shadow-[0_5px_0_rgb(153,27,27)] transition active:translate-y-1 active:shadow-[0_2px_0_rgb(153,27,27)]"
          >
            PLAY
          </button>
        </div>
      </div>
    </div>
  )
}

function CarBadge({ color, accent }: { color: string; accent: string }) {
  return (
    <div className="relative h-12 w-20">
      <div className="absolute bottom-2 left-1 right-1 h-6 rounded-md" style={{ background: color }} />
      <div className="absolute bottom-6 left-4 right-4 h-4 rounded-t-md" style={{ background: accent }} />
      <div className="absolute bottom-0 left-2 h-4 w-4 rounded-full bg-gray-900" />
      <div className="absolute bottom-0 right-2 h-4 w-4 rounded-full bg-gray-900" />
    </div>
  )
}
