import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="">
      <div className="container  py-3">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Made with Love ❤ by Awais Rao in Lahore
        </p>
      </div>
    </footer>
  )
}

