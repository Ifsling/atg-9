"use client"

import dynamic from "next/dynamic"

// Prevent SSR
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
