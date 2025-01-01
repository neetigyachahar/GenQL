import { IndexDatabaseContext } from "@/contexts/IndexDatabaseContext"
import { chunkTablesJson } from "@/lib/splitSchemaJson"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import { DELETE_SCHEMA_API, INDEX_SCHEMA_API_URL } from "@/lib/constants"

interface ApiResponse {
    reference: string
    success: boolean
    error?: string
}

const calculateProgress = (currentIndex: number, totalItems: number): number => {
    return Math.round((currentIndex / totalItems) * 100)
}

const useIndexSchema = () => {
    const referenceIdRef = useRef<string | null>(null)

    const { jsonEditorValue, referenceId, setReferenceId, setJsonEditorValue } = useContext(IndexDatabaseContext)

    const [indexProgress, setIndexProgress] = useState<number>(0)
    const [isIndexing, setIsIndexing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [deletingSchema, setDeletingSchema] = useState(false)

    const updateSchemaInLocalStorage = () => {
        localStorage.setItem("referenceId", referenceIdRef.current || "")
        localStorage.setItem("jsonEditorValue", jsonEditorValue || "")
    }

    const getSchemaFromLocalStorage = () => {
        setReferenceId(localStorage.getItem("referenceId") || null)
        setJsonEditorValue(localStorage.getItem("jsonEditorValue") || "")
    }

    const deleteSchemaInLocalStorage = () => {
        localStorage.removeItem("referenceId")
        localStorage.removeItem("jsonEditorValue")
    }

    useEffect(() => {
        getSchemaFromLocalStorage()
    }, [])

    const deleteSchema = async (
    ): Promise<ApiResponse> => {
        const reference = referenceIdRef.current || referenceId
        setDeletingSchema(true)
        try {
            const response = await axios.post(
                DELETE_SCHEMA_API,
                { reference }
            )

            setReferenceId(null)
            referenceIdRef.current = null
            resetIndex()
            setJsonEditorValue("")
            deleteSchemaInLocalStorage()

            return response.data
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data || err.message || "An unknown Axios error occurred")
            } else {
                throw new Error("An unknown error occurred")
            }
        }
        finally {
            setDeletingSchema(false)
        }
    }

    const indexSchemaChunk = async (
        item: any,
        reference: string | null
    ): Promise<ApiResponse> => {
        try {
            const response = await axios.post(
                INDEX_SCHEMA_API_URL,
                {
                    reference,
                    db_schema: item,
                }
            )

            return response.data
        } catch (err) {
            if (referenceIdRef.current)
                deleteSchema()
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data || err.message || "An unknown Axios error occurred")
            } else {
                throw new Error("An unknown error occurred")
            }
        }
    }

    const indexSchema = useCallback(async () => {
        try {
            setIsIndexing(true)
            setError(null)
            setIndexProgress(0)

            // Parse and validate the JSON
            let schemaArray
            try {
                schemaArray = chunkTablesJson(JSON.parse(jsonEditorValue))
            } catch (err) {
                throw new Error("Invalid JSON format")
            }

            if (!Array.isArray(schemaArray)) {
                throw new Error("Expected an array of schema objects")
            }

            if (schemaArray.length > 40) {
                throw new Error("Too many tables in the schema.")
            }

            for (const [index, schema] of schemaArray.entries()) {
                console.log({ index })
                const response = await indexSchemaChunk(schema, referenceIdRef.current)

                referenceIdRef.current = response.reference

                setIndexProgress(calculateProgress(index + 1, schemaArray.length))
            }

            setReferenceId(referenceIdRef.current)
            updateSchemaInLocalStorage()
            referenceIdRef.current = null

            setIndexProgress(100)

            setTimeout(() => {
                setIsIndexing(false)
                setIndexProgress(0)
            }, 1000)

        } catch (err) {
            console.log(err)
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            setIsIndexing(false)
            setIndexProgress(0)
        }
    }, [jsonEditorValue])

    const resetIndex = useCallback(() => {
        setIndexProgress(0)
        setIsIndexing(false)
        setError(null)
    }, [])

    return {
        indexProgress,
        isIndexing,
        error,
        deletingSchema,
        deleteSchema,
        indexSchema,
        resetIndex,
    }
}

export default useIndexSchema
