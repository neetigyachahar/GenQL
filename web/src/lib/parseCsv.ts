import Papa from 'papaparse'

interface Column {
    name: string;
    description: string;
}

interface Table {
    name: string;
    columns: Column[];
}

interface CsvRow {
    table_name: string;
    table_comment: string;
    column_name: string | null;
    column_comment: string;
    is_nullable: string;
    data_type: string;
    constraint_type: string | null;
    referenced_table: string | null;
    referenced_column: string | null;
}

const parseNull = (str: string | null) => str === 'NULL' ? null : str


function processCSV(csvData: CsvRow[]): { tables: Table[] } {
    // Group by table_name
    const tableGroups = csvData.reduce((acc, row) => {
        if (!acc[row.table_name]) {
            acc[row.table_name] = [];
        }
        acc[row.table_name].push(row);
        return acc;
    }, {} as Record<string, CsvRow[]>);

    // Process each table group
    const tables: Table[] = Object.entries(tableGroups).map(([tableName, rows]) => {
        // Find table comment (row where column_name is null)
        const description = rows.find(row => row.column_name === "NULL")?.table_comment;
        console.log(rows)

        // Filter and map columns (exclude rows where column_name is null)
        const columns: Column[] = rows
            .filter(row => row.column_name !== "NULL")
            .map(row => ({
                name: parseNull(row.column_name)!,
                description: parseNull(row.column_comment) || '',
                is_nullable: parseNull(row.is_nullable),
                data_type: parseNull(row.data_type),
                constraint_type: parseNull(row.constraint_type),
                referenced_table: parseNull(row.referenced_table),
                referenced_column: parseNull(row.referenced_column),
            }));

        return {
            name: tableName,
            description: parseNull(description ?? null),
            columns: columns
        };
    }).filter(column => column.name);

    return { tables };
}

export const parseAndProcessCSV = (csvContent: string) => {
    return new Promise((resolve, reject) => {
        Papa.parse(csvContent, {
            header: true,
            complete: (results) => {
                try {
                    const processed = processCSV(results.data as CsvRow[]);
                    resolve(processed);
                } catch (error) {
                    reject(error);
                }
            },
            error: (error: any) => {
                reject(error);
            }
        });
    });
}
