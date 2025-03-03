import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export default function Navbar() {
  const handleNewChatClick = () => {
    window.location.reload()
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 text-lg md:text-2xl flex items-center space-x-2 font-mono font-semibold">
          <h1 onClick={handleNewChatClick}>DocumentChat</h1>
        </Link>
        
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
   
        </nav>
        <div className="flex items-center space-x-4">

          <Link href="/">
          <Button size="sm" onClick={handleNewChatClick}>
          New Chat</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

