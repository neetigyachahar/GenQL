import { useImperativeHandle, useRef } from "react"
import Editor from "@monaco-editor/react"
import { useTheme } from "next-themes"

const JsonEditor = ({ value = "", onChange, ref, isLocked }: any) => {
  const editorRef = useRef<any>(null)
  const { resolvedTheme } = useTheme()

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleChange = (value: any) => onChange(value)

  useImperativeHandle(ref, () => ({
    formatJson,
  }))

  const formatJson = () => {
    if (editorRef.current) {
      try {
        editorRef.current.getAction("editor.action.formatDocument").run()
      } catch (error) {
        console.error("Invalid JSON")
      }
    }
  }

  return (
    <Editor
      className="w-full border-b"
      defaultLanguage="json"
      value={value}
      theme={resolvedTheme === "light" ? "light" : "vs-dark"}
      onChange={handleChange}
      onMount={handleEditorDidMount}
      options={{
        readOnlyMessage:{value: "Schema is locked."},
        readOnly: isLocked,
        tabSize: 2,
        minimap: { enabled: false },
        formatOnPaste: true,
        formatOnType: true,
        automaticLayout: true,
        wordWrap: "on",
        folding: true,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        fontSize: 12,
      }}
    />
  )
}

export default JsonEditor
