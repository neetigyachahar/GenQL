"use client"

import GenerateQuery from "@/components/GenerateQuery"
import GetStarted from "@/components/GetStarted"
import SetupSchemaLeftPane from "@/components/SetupSchemaLeftPane"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { IndexDatabaseContext } from "@/contexts/IndexDatabaseContext"
import { useContext } from "react"

export default function Home() {
  const { isSchemaIndexed } = useContext(IndexDatabaseContext)

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex flex-1 items-stretch"
    >
      <ResizablePanel defaultSize={25} className="min-w-80 flex">
        <SetupSchemaLeftPane />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={75}
        className="min-w-[600px] grid flex-1 items-center"
      >
        {!isSchemaIndexed && <GetStarted />}
        {isSchemaIndexed && <GenerateQuery />}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
