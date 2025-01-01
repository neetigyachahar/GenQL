import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getScoreVariant = (score: number) => {
  if (score >= 0.8) return "default"
  if (score >= 0.7) return "secondary"
  return "destructive"
}
