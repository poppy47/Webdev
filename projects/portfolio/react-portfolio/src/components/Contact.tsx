import React from 'react'
import { motion } from 'framer-motion'

export default function Contact(){
  return (
    <motion.section id="contact" initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mt-12 mb-12">
      <h2 className="text-2xl font-semibold text-white">Contact</h2>
      <p className="text-slate-300 mt-2">Interested in working together? Send a message.</p>
      <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl" onSubmit={(e)=>{e.preventDefault(); alert('Message sent (demo)')}}>
        <input placeholder="Name" className="p-3 bg-white/3 rounded-md border border-white/6 text-white" required />
        <input placeholder="Email" type="email" className="p-3 bg-white/3 rounded-md border border-white/6 text-white" required />
        <textarea placeholder="Message" className="md:col-span-2 p-3 bg-white/3 rounded-md border border-white/6 text-white" rows={6} required />
        <div className="md:col-span-2">
          <button className="px-4 py-2 bg-indigo-500 rounded-md text-white">Send message</button>
        </div>
      </form>
    </motion.section>
  )
}
