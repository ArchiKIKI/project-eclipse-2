import Header from "./Header"
import Hero from "./Hero"
import type { LandingPageProps } from "./types"

export { Header, Hero }

export default function LandingPage({ showHeader = true }: LandingPageProps) {
  return (
    <main className="min-h-screen bg-white dark:bg-[#111111]">
      {showHeader && <Header />}
      <div className="container pt-4">
        <Hero />
      </div>
    </main>
  )
}