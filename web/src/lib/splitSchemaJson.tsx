export const chunkTablesJson = (
  jsonData: any,
  chunkSize: number = 10
): any[] => {
  // Validate input
  if (!jsonData || !Array.isArray(jsonData.tables)) {
    throw new Error("Input JSON must have a 'tables' array")
  }

  const tables = jsonData.tables

  // If tables is empty or has fewer items than chunkSize, return original
  if (!tables.length || tables.length <= chunkSize) {
    return [jsonData]
  }

  // Calculate number of chunks needed
  const numChunks = Math.ceil(tables.length / chunkSize)

  // Create chunked result
  const result = []

  for (let i = 0; i < numChunks; i++) {
    const startIdx = i * chunkSize
    const endIdx = Math.min((i + 1) * chunkSize, tables.length)

    // Create new object with same structure but chunked tables
    const chunkedData = {
      tables: tables.slice(startIdx, endIdx),
    }

    result.push(chunkedData)
  }

  return result
}
