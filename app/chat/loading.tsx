

import { Loader2 } from 'lucide-react'

export default function LoadingChat() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <p className="text-lg font-semibold text-foreground">Loading...</p>
      </div>
    </div>
  )
}
