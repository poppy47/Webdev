import React from 'react'

export default function Navbar(){
  return (
    <header className="w-full fixed top-4 left-0 z-40">
      <div className="mx-auto max-w-5xl px-4">
        <nav className="backdrop-blur bg-white/5 border border-white/6 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-indigo-500 flex items-center justify-center font-bold">SP</div>
            <div className="text-white font-semibold">Sukhdev Pratap Singh</div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-slate-300">
            <a href="#" className="hover:text-white">Home</a>
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#experience" className="hover:text-white">Experience</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <a className="text-sm px-3 py-1 border rounded-md border-white/6 text-slate-200 hover:bg-white/5" href="/resume.pdf" download>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M12 11v6" />
                <path d="M9 14l3 3 3-3" />
              </svg>
              <span className="ml-2">Resume</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
