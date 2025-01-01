import React, { FC } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "lucide-react"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { getScoreVariant } from "@/lib/utils"
import { Table } from "@/lib/types"

interface SqlAnalysisProps {
  tables: Table[]
}

const SqlAnalysis: FC<SqlAnalysisProps> = ({ tables }) => (
  <Card className="bg-white bg-transparent shadow-none ">
    <CardHeader className="space-y-1">
      <div className="flex items-center space-x-2">
        <Database className="h-5 w-5 text-blue-500" />
        <CardTitle className="text-lg">SQL Analysis</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <ScrollArea>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Tables Referenced
          </h3>
          <div className="grid gap-2">
            {tables.map((table, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <span className="font-mono text-sm">{table.table_name}</span>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={getScoreVariant(table.score)}
                    className="text-xs"
                  >
                    {(table.score * 100).toFixed(1)}% match
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-4 border-t">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Total Tables</dt>
              <dd className="font-medium mt-1">{tables.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Average Match Score</dt>
              <dd className="font-medium mt-1">
                {(
                  (tables.reduce((acc, table) => acc + table.score, 0) /
                    tables.length) *
                  100
                ).toFixed(1)}
                %
              </dd>
            </div>
          </dl>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CardContent>
  </Card>
)

export default SqlAnalysis
