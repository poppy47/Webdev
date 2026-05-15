import React from 'react'
import ProjectCard from './ProjectCard'
import { motion } from 'framer-motion'

const projects = [
  { id:1, title:'Project One', desc:'A modern web app using React and TypeScript', tech:['React','TypeScript','Node'], live:'#', code:'#' },
  { id:2, title:'Project Two', desc:'Serverless API and dashboard', tech:['AWS','Node','DynamoDB'], live:'#', code:'#' },
  { id:3, title:'Project Three', desc:'Design system and component library', tech:['React','Storybook'], live:'#', code:'#' }
]

export default function Projects(){
  return (
    <motion.section id="projects" initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mt-12">
      <h2 className="text-2xl font-semibold text-white">Selected Projects</h2>
      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </motion.section>
  )
}
