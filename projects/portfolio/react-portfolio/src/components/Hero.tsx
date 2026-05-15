import React from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
}

export default function Hero(){
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="pt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-white leading-tight">Hi, I'm Sukhdev — a developer who builds delightful, performant web apps.</h1>
          <p className="mt-4 text-slate-300 max-w-xl">I specialize in modern React applications, TypeScript, and accessible UI. I enjoy mentoring engineers and improving developer workflows.</p>
          <div className="mt-6 flex gap-4">
            <a href="/resume.pdf" download className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Download Resume</span>
            </a>
            <a href="#contact" className="px-4 py-2 border rounded-md border-white/6 text-slate-200">Contact</a>
          </div>
        </div>
        <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} transition={{duration:0.6}} className="hidden md:flex justify-center">
          <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-400 shadow-2xl flex items-center justify-center text-white font-bold">Photo</div>
        </motion.div>
      </div>
    </motion.section>
  )
}
