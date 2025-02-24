import { Loader2 } from "lucide-react"

export function Loader({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

