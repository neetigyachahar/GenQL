import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, X, Check, Loader2 } from "lucide-react"

const DeleteSchemaButton = ({
  onDelete,
  isLoading,
}: {
  onDelete: () => void
  isLoading: boolean
}) => {
  const [confirming, setConfirming] = useState(false)

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
  }

  const handleConfirm = () => {
    onDelete()
    setConfirming(false)
  }

  const handleCancel = () => {
    setConfirming(false)
  }

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Deleting...
      </Button>
    )
  }

  if (confirming) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-green-500 hover:text-green-600 hover:bg-green-50"
          onClick={handleConfirm}
        >
          <Check className="w-4 h-4 mr-2" />
          Confirm
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleCancel}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-red-400 hover:text-red-600 hover:bg-red-50"
      onClick={handleClick}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      Delete Schema
    </Button>
  )
}

export default DeleteSchemaButton
