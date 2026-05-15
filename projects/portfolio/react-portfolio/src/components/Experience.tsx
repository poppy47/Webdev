import React from 'react'
import { motion } from 'framer-motion'

const data = [
  { company:'Acme Corp', role:'Senior Frontend Engineer', dates:'2022 — Present', bullets:['Led migration to React + TypeScript','Improved performance by 35%'] },
  { company:'Tech Co', role:'Frontend Engineer', dates:'2019 — 2022', bullets:['Built component library','Mentored junior engineers'] }
]

export default function Experience(){
  return (
    <motion.section id="experience" initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mt-12">
      <h2 className="text-2xl font-semibold text-white">Experience</h2>
      <div className="mt-6 space-y-6">
        {data.map((d,i)=> (
          <div key={i} className="pl-4 border-l border-white/6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{d.role}</div>
                <div className="text-slate-300 text-sm">{d.company}</div>
              </div>
              <div className="text-slate-400 text-sm">{d.dates}</div>
            </div>
            <ul className="mt-3 list-disc list-inside text-slate-300">
              {d.bullets.map((b,idx)=> <li key={idx}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
