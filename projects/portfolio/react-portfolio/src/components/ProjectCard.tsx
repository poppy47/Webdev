import React from 'react'
import { motion } from 'framer-motion'

type Props = { project: { id:number, title:string, desc:string, tech:string[], live:string, code:string } }

export default function ProjectCard({project}:Props){
  return (
    <motion.article whileHover={{ scale: 1.02 }} className="bg-white/3 border border-white/6 rounded-xl overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold">Image</div>
      <div className="p-4">
        <h3 className="font-semibold text-white">{project.title}</h3>
        <p className="text-slate-300 mt-2 text-sm">{project.desc}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tech.map(t => <span key={t} className="text-xs bg-white/6 px-2 py-1 rounded-full">{t}</span>)}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <a href={project.code} aria-label="Source" className="text-slate-200 hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 19c-4.97 1.5-5-2-5-2" strokeLinejoin="round"/><path d="M15 5c4.97-1.5 5 2 5 2" strokeLinejoin="round"/><path d="M8.5 14.5L15.5 9.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href={project.live} aria-label="Live" className="text-slate-200 hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" strokeLinecap="round"/><path d="M12 5l7 7-7 7" strokeLinecap="round"/></svg>
          </a>
        </div>
      </div>
    </motion.article>
  )
}
