import React from 'react'
import HomeNav from './HomeNav'
import Hero from './Hero'
import Footer from './Footer'
import Features from './Features'

export default function HomePage() {
  return (
    <section className={`selection:bg-[#fcfc9e]`}>
      <HomeNav />
      <Hero />
      <Features />
      <Footer />
    </section>
  )
}
