"use client"

import { useState } from "react"

export default function ClientSidebarDropdown({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden w-full flex flex-col">
      <button
        className="flex items-center gap-2 px-4 py-2 border-b bg-background text-lg font-bold"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open sidebar menu"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        Menu
      </button>
      {/* Animated full-width dropdown */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Backdrop */}
        {open && (
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar menu"
          />
        )}
        <div
          className={`absolute top-0 left-0 w-full transition-all duration-300 z-50 pointer-events-auto ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="w-full bg-card border-b overflow-y-auto max-h-[80vh] text-left">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 