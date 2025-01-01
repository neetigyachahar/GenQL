"use client"

import React, { useCallback, useContext, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { IndexDatabaseContext } from "@/contexts/IndexDatabaseContext"
import { parseAndProcessCSV } from "@/lib/parseCsv"

interface FileUploaderProps {
  maxSize?: number
}

type AcceptedFileType = "json" | "csv"

interface FileWithPreview extends File {
  preview?: string
}

const FileUploader: React.FC<FileUploaderProps> = ({
  maxSize = 5 * 1024 * 1024,
}) => {
  const { setJsonEditorValue } = useContext(IndexDatabaseContext)
  const [file, setFile] = useState<FileWithPreview | null>(null)
  const [error, setError] = useState<string>("")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0]

      if (uploadedFile) {
        if (uploadedFile.size > maxSize) {
          setError(`File size should be less than ${maxSize / (1024 * 1024)}MB`)
          return
        }

        const fileType = uploadedFile.name
          .split(".")
          .pop()
          ?.toLowerCase() as AcceptedFileType

        if (["json", "csv"].includes(fileType)) {
          setFile(uploadedFile)
          setError("")

          const reader = new FileReader()
          reader.onload = async (event: ProgressEvent<FileReader>) => {
            try {
              const content = event.target?.result as string
              if (fileType === "json") {
                setJsonEditorValue(JSON.stringify(JSON.parse(content), null, 2))
              } else if (fileType === "csv") {
                setJsonEditorValue(
                  JSON.stringify(await parseAndProcessCSV(content), null, 2)
                )
              }
            } catch (err) {
              setError(
                `Error reading file: ${
                  err instanceof Error ? err.message : "Unknown error"
                }`
              )
            }
          }

          reader.readAsText(uploadedFile)
        } else {
          setError("Please upload only JSON or CSV files")
        }
      }
    },
    [maxSize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      "text/csv": [".csv"],
    },
    multiple: false,
    maxSize,
  })

  const removeFile = () => {
    setFile(null)
    setError("")
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-[#252525]">
      <div
        {...getRootProps()}
        className={cn(
          "p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200",
          isDragActive && "border-primary bg-primary/10",
          error && "border-red-500",
          !isDragActive && !error && "border-gray-300 dark:border-gray-600",
          "hover:border-primary dark:hover:border-primary",
          "dark:bg-[#252525]"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <Upload
            className={cn(
              "w-12 h-12",
              isDragActive ? "text-primary" : "text-gray-400 dark:text-gray-500"
            )}
          />

          {file ? (
            <div className="flex items-center gap-2 text-sm">
              <File className="w-4 h-4" />
              <span className="dark:text-gray-200">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
                className="hover:bg-transparent"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className={cn("text-sm", "text-gray-600 dark:text-gray-300")}>
                Drag and drop your file here, or click to select
              </p>
              <p
                className={cn(
                  "mt-2 text-xs",
                  "text-gray-500 dark:text-gray-400"
                )}
              >
                Supports JSON and CSV files up to {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

export default FileUploader
