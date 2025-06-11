"use client"

import { useEffect, useState } from "react"

interface MenuScreenProps {
  onStartGame: () => void
}

export default function MenuScreen({ onStartGame }: MenuScreenProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && settingsOpen) {
        setSettingsOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [settingsOpen])

  return (
    <div className="relative w-full h-screen flex items-center">
      <div className="absolute inset-0 bg-black/50 z-0">
        <img
          src="/images/menu-screen-bg.png"
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Left side gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>

      {/* Menu content */}
      <div className="relative z-20 w-full max-w-md pl-12 md:pl-24">
        <div className="space-y-4">
          <button
            className="w-full text-xl py-6 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 font-medium"
            onClick={onStartGame}
          >
            Start Game
          </button>

          <button
            className="w-full text-xl py-6 px-4 border border-white text-white hover:bg-white/10 rounded-md transition-colors duration-200 font-medium"
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Custom Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-xl transform transition-all">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 mb-2">Settings</h3>
              <p className="text-sm text-gray-300 mb-4">
                There are no settings available. All you can do is play the
                game.
              </p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200"
                  onClick={() => setSettingsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
