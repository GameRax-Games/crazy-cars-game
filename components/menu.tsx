"use client"

import { CARS } from "@/lib/cars"
import { Star, Lock, Gauge, Zap, User, Users } from "lucide-react"

type Mode = "1p" | "2p"

interface MenuProps {
  bank: number
  mode: Mode
  onModeChange: (m: Mode) => void
  selected1: string
  selected2: string
  onSelect1: (id: string) => void
  onSelect2: (id: string) => void
  onPlay: () => void
}

export function Menu({
  bank,
  mode,
  onModeChange,
  selected1,
  selected2,
  onSelect1,
  onSelect2,
  onPlay,
}: MenuProps) {
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

        {/* Mode toggle */}
        <div className="mb-4 flex justify-center">
          <div className="flex gap-1 rounded-2xl bg-black/25 p-1 backdrop-blur-md">
            <ModeButton active={mode === "1p"} onClick={() => onModeChange("1p")}>
              <User className="h-4 w-4" /> 1 Player
            </ModeButton>
            <ModeButton active={mode === "2p"} onClick={() => onModeChange("2p")}>
              <Users className="h-4 w-4" /> 2 Players
            </ModeButton>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-center gap-2 text-white">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 drop-shadow" />
          <span className="text-2xl font-black tabular-nums drop-shadow">{bank}</span>
          <span className="font-medium text-white/80">stars banked</span>
        </div>

        {mode === "1p" ? (
          <CarGrid bank={bank} selected={selected1} onSelect={onSelect1} cols="grid-cols-2 sm:grid-cols-3" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-black/15 p-3 backdrop-blur-sm">
              <PlayerHeading label="PLAYER 1" keysHint="WASD · Shift" color="#2563eb" />
              <CarGrid bank={bank} selected={selected1} onSelect={onSelect1} cols="grid-cols-2" ring="#2563eb" />
            </div>
            <div className="rounded-3xl bg-black/15 p-3 backdrop-blur-sm">
              <PlayerHeading label="PLAYER 2" keysHint="Arrows · Enter" color="#f97316" />
              <CarGrid bank={bank} selected={selected2} onSelect={onSelect2} cols="grid-cols-2" ring="#f97316" />
            </div>
          </div>
        )}

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

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-black transition ${
        active ? "bg-white text-sky-600 shadow" : "text-white/90 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  )
}

function PlayerHeading({ label, keysHint, color }: { label: string; keysHint: string; color: string }) {
  return (
    <div className="mb-2 flex items-center justify-between px-1">
      <span className="rounded-lg px-2 py-0.5 text-sm font-black text-white shadow" style={{ background: color }}>
        {label}
      </span>
      <span className="text-xs font-semibold text-white/80">{keysHint}</span>
    </div>
  )
}

function CarGrid({
  bank,
  selected,
  onSelect,
  cols,
  ring = "#ffffff",
}: {
  bank: number
  selected: string
  onSelect: (id: string) => void
  cols: string
  ring?: string
}) {
  return (
    <div className={`grid gap-3 ${cols}`}>
      {CARS.map((car) => {
        const unlocked = bank >= car.price
        const isSelected = selected === car.id
        return (
          <button
            key={car.id}
            disabled={!unlocked}
            onClick={() => onSelect(car.id)}
            style={isSelected ? { borderColor: ring, boxShadow: `0 0 0 2px ${ring}` } : undefined}
            className={`group relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition ${
              isSelected ? "bg-white/40 shadow-xl" : "border-white/40 bg-white/20 hover:bg-white/30"
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
          </button>
        )
      })}
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
