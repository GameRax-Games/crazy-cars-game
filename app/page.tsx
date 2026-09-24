"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { CARS } from "@/lib/cars"
import { useKeyboard } from "@/lib/use-keyboard"
import type { TouchControls } from "@/components/car"
import { GameCanvas } from "@/components/game-canvas"
import { STAR_COUNT } from "@/components/collectibles"
import { Hud } from "@/components/hud"
import { Menu } from "@/components/menu"

export default function Page() {
  const [phase, setPhase] = useState<"menu" | "playing">("menu")
  const [selected, setSelected] = useState(CARS[0].id)
  const [bank, setBank] = useState(0)
  const [runCollected, setRunCollected] = useState(0)
  const [resetSignal, setResetSignal] = useState(0)

  const collectedIds = useRef<Set<number>>(new Set())
  const keys = useKeyboard()
  const touch = useRef<TouchControls>({ forward: false, back: false, left: false, right: false, brake: false })

  const config = useMemo(() => CARS.find((c) => c.id === selected) ?? CARS[0], [selected])

  const handleCollect = useCallback((id: number) => {
    if (collectedIds.current.has(id)) return
    collectedIds.current.add(id)
    setRunCollected((c) => c + 1)
    setBank((b) => b + 1)
  }, [])

  const startRun = useCallback(() => {
    collectedIds.current = new Set()
    setRunCollected(0)
    setResetSignal((s) => s + 1)
    setPhase("playing")
  }, [])

  const resetRun = useCallback(() => {
    collectedIds.current = new Set()
    setRunCollected(0)
    setResetSignal((s) => s + 1)
  }, [])

  if (phase === "menu") {
    return <Menu bank={bank} selected={selected} onSelect={setSelected} onPlay={startRun} />
  }

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <GameCanvas
        config={config}
        keys={keys}
        touch={touch}
        resetSignal={resetSignal}
        onCollect={handleCollect}
      />
      <Hud
        collected={runCollected}
        total={STAR_COUNT}
        onReset={resetRun}
        onMenu={() => setPhase("menu")}
        touch={touch}
      />
    </main>
  )
}
