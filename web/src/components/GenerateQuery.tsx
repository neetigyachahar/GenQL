import useGenerateSql from "@/hooks/useGenerateSql"
import GenerateQueryInput from "./GenerateQueryInput"
import GeneratedSQL from "./GeneratedSQL"
import SqlAnalysis from "./SqlAnalysis"

const GenerateQuery = () => {
  const { generateSql, generatedSql, isLoading, searchResults } =
    useGenerateSql()

  return (
    <section className="flex flex-col gap-10 items-center p-12 h-full opacity-0 animate-[fadeIn_0.5s_ease-in] [animation-fill-mode:forwards] [animation-delay:1s]">
      <GenerateQueryInput onGenerate={generateSql} isLoading={isLoading} />
      <div className="flex-1 w-full flex items-start justify-stretch">
        {generatedSql && (
          <div className="flex flex-1 h-full items-center justify-center">
            <GeneratedSQL text={generatedSql} />
          </div>
        )}
        {searchResults && <SqlAnalysis tables={searchResults} />}
      </div>
    </section>
  )
}

export default GenerateQuery
