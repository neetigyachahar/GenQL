import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface LoadingPopupProps {
  isOpen: boolean
  progress: number
  message?: string
}

const LoadingPopup = ({
  isOpen,
  progress = 0,
  message = "Loading...",
}: LoadingPopupProps) => (
  <Dialog open={isOpen}>
    <DialogTitle className="sr-only">Indexing</DialogTitle>
    <DialogContent className="sm:max-w-md" hideClose>
      <div className="flex flex-col items-center justify-center gap-6 py-8">
        <div className="flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xl font-semibold">{message}</span>
        </div>
        <div className="w-full space-y-2">
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-center text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

export default LoadingPopup
