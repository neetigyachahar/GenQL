import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import { ThemeProvider } from "next-themes"
import { IndexDatabaseProvider } from "@/contexts/IndexDatabaseContext"
import { GenerateQueryContextProvider } from "@/contexts/GenerateQueryContext"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "GenQL",
  description: "Generate SQL query from natural language.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
      >
        <GenerateQueryContextProvider>
          <IndexDatabaseProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Header />
              {children}
            </ThemeProvider>
          </IndexDatabaseProvider>
        </GenerateQueryContextProvider>
      </body>
    </html>
  )
}
