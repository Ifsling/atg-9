"use client"

import dynamic from "next/dynamic"

const PhaserGame = dynamic(() => import("../components/PhaserGame"), {
  ssr: false,
})

export default function App() {
  return (
    <div>
      <PhaserGame />
    </div>
  )
}
