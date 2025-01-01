import FileUploader from "./FileUploader"
import GetStartedInfo from "@/components/md/get-started.mdx"

const GetStarted = () => (
  <article className="mx-auto min-w-96 prose prose-sm prose-slate dark:prose-invert">
    <GetStartedInfo />
    <FileUploader />
  </article>
)

export default GetStarted
