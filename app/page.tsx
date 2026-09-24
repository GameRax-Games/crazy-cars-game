"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { CARS } from "@/lib/cars"
import { useKeyboard } from "@/lib/use-keyboard"
import { SOLO_CONTROLS, P1_CONTROLS, P2_CONTROLS } from "@/lib/controls"
import { createCarState, gameStore } from "@/lib/game-store"
import type { TouchControls } from "@/components/car"
import { GameCanvas } from "@/components/game-canvas"
import { STAR_COUNT } from "@/components/collectibles"
import { Hud } from "@/components/hud"
import { PlayerHud } from "@/components/player-hud"
import { Menu } from "@/components/menu"
import { RotateCcw, Home } from "lucide-react"

type Mode = "1p" | "2p"

export default function Page() {
  const [phase, setPhase] = useState<"menu" | "playing">("menu")
  const [mode, setMode] = useState<Mode>("1p")
  const [selected1, setSelected1] = useState(CARS[0].id)
  const [selected2, setSelected2] = useState(CARS[1].id)
  const [bank, setBank] = useState(0)
  const [collected1, setCollected1] = useState(0)
  const [collected2, setCollected2] = useState(0)
  const [resetSignal, setResetSignal] = useState(0)

  const collectedIds1 = useRef<Set<number>>(new Set())
  const collectedIds2 = useRef<Set<number>>(new Set())
  const keys = useKeyboard()
  const touch = useRef<TouchControls>({ forward: false, back: false, left: false, right: false, brake: false })

  // Player 1 uses the shared singleton so single-player HUD keeps working.
  const store1 = gameStore
  const store2 = useRef(createCarState()).current

  const config1 = useMemo(() => CARS.find((c) => c.id === selected1) ?? CARS[0], [selected1])
  const config2 = useMemo(() => CARS.find((c) => c.id === selected2) ?? CARS[1], [selected2])

  const collect = useCallback(
    (
      id: number,
      ids: React.MutableRefObject<Set<number>>,
      setCount: React.Dispatch<React.SetStateAction<number>>,
    ) => {
      if (ids.current.has(id)) return
      ids.current.add(id)
      setCount((c) => c + 1)
      setBank((b) => b + 1)
    },
    [],
  )

  const handleCollect1 = useCallback((id: number) => collect(id, collectedIds1, setCollected1), [collect])
  const handleCollect2 = useCallback((id: number) => collect(id, collectedIds2, setCollected2), [collect])

  const beginRun = useCallback(() => {
    collectedIds1.current = new Set()
    collectedIds2.current = new Set()
    setCollected1(0)
    setCollected2(0)
    setResetSignal((s) => s + 1)
  }, [])

  const startRun = useCallback(() => {
    beginRun()
    setPhase("playing")
  }, [beginRun])

  if (phase === "menu") {
    return (
      <Menu
        bank={bank}
        mode={mode}
        onModeChange={setMode}
        selected1={selected1}
        selected2={selected2}
        onSelect1={setSelected1}
        onSelect2={setSelected2}
        onPlay={startRun}
      />
    )
  }

  if (mode === "2p") {
    return (
      <main className="relative flex h-screen w-full overflow-hidden">
        <div className="relative h-full w-1/2 border-r-4 border-black/60">
          <GameCanvas
            config={config1}
            keys={keys}
            controls={P1_CONTROLS}
            store={store1}
            resetSignal={resetSignal}
            onCollect={handleCollect1}
          />
          <PlayerHud store={store1} collected={collected1} total={STAR_COUNT} label="P1" accent="#2563eb" />
        </div>
        <div className="relative h-full w-1/2">
          <GameCanvas
            config={config2}
            keys={keys}
            controls={P2_CONTROLS}
            store={store2}
            resetSignal={resetSignal}
            onCollect={handleCollect2}
          />
          <PlayerHud store={store2} collected={collected2} total={STAR_COUNT} label="P2" accent="#f97316" />
        </div>

        {/* Shared controls */}
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center gap-2">
          <button
            onClick={beginRun}
            className="pointer-events-auto flex items-center gap-1 rounded-2xl bg-black/50 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/70"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={() => setPhase("menu")}
            className="pointer-events-auto flex items-center gap-1 rounded-2xl bg-black/50 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/70"
          >
            <Home className="h-4 w-4" /> Menu
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <GameCanvas
        config={config1}
        keys={keys}
        controls={SOLO_CONTROLS}
        store={store1}
        touch={touch}
        resetSignal={resetSignal}
        onCollect={handleCollect1}
      />
      <Hud
        collected={collected1}
        total={STAR_COUNT}
        onReset={beginRun}
        onMenu={() => setPhase("menu")}
        touch={touch}
        store={store1}
      />
    </main>
  )
}
