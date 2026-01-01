"use client"

interface StartMenuProps {
  onStart: () => void
}

export function StartMenu({ onStart }: StartMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="max-w-3xl w-full mx-4 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">VIRTUAL GALLERY</h1>

        <div className="w-24 h-1 bg-white mx-auto mb-12"></div>

        <div className="space-y-8 mb-16">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-2">Name</h2>
            <p className="text-3xl md:text-4xl font-bold text-white">Ahmad Fahim</p>
          </div>

          <div>
            <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-2">Experience</h2>
            <p className="text-xl md:text-2xl text-white font-medium">Full-stack Developer & Creative Designer</p>
          </div>

          <div className="max-w-xl mx-auto">
            <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-3">How to Navigate</h2>
            <p className="text-zinc-300 leading-relaxed">
              Use <span className="text-white font-semibold">Arrow Keys</span> or{" "}
              <span className="text-white font-semibold">WASD</span> to move around. Get close to artworks and press{" "}
              <span className="text-white font-semibold">Enter</span> to view details.
            </p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="px-12 py-4 bg-white text-black text-lg font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors duration-300"
        >
          Enter Gallery
        </button>

        <p className="text-zinc-500 text-sm mt-8 uppercase tracking-wide">Press Enter to Start</p>
      </div>
    </div>
  )
}
