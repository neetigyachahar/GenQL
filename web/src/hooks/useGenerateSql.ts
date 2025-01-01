import { GenerateQueryContext } from "@/contexts/GenerateQueryContext"
import { IndexDatabaseContext } from "@/contexts/IndexDatabaseContext"
import { GENERATE_QUERY_API } from "@/lib/constants"
import axios from "axios"
import { useContext, useEffect, useState } from "react"

const useGenerateSql = () => {
  const { referenceId } = useContext(IndexDatabaseContext)
  const { generatedSql, setGeneratedSql, searchResults, setSearchResults } =
    useContext(GenerateQueryContext)
  const [isLoading, setIsLoading] = useState(false)

  const generateSql = async (text: string) => {
    setIsLoading(true)
    try {
      const response = await axios.post(GENERATE_QUERY_API, {
        input: text,
        reference: referenceId,
      })
      setGeneratedSql(response.data.result)
      setSearchResults(response.data.search_results)
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error generating SQL query:", error.message)
      } else {
        console.error("Error generating SQL query:", String(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      setGeneratedSql(null)
      setSearchResults(null)
    }
  }, [])

  return {
    isLoading,
    generatedSql,
    generateSql,
    searchResults,
  }
}

export default useGenerateSql
