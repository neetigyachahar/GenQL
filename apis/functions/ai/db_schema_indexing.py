from ai.core import vector_db, get_embedding
import uuid

def create_chunk_and_index(db_schema, namespace):
    if namespace == None:
        namespace = str(uuid.uuid4())

    index = vector_db()

    for table in db_schema["tables"]:
        table_name = table["name"]
        table_description = table.get("description", None)
        columns_info = ""

        for col in table["columns"]:
            col_name = col["name"]
            col_description = col.get("description", None)
            columns_info += f"It has column with name '{col_name}'"

            if col_description != None:
                columns_info += f" which has description '{col_description}'"

            columns_info += ". "

        
        grammar_string = f"The table name: '{table_name}'"

        if table_description != None:
            grammar_string += f" has description: '{table_description}'"
        
        grammar_string += f". {columns_info}"

        embedding = get_embedding(grammar_string)

        index.upsert(vectors=[
            {
                "id":table_name,
                "values": embedding,
                "metadata": {"description": grammar_string},
            }
        ], namespace=namespace)

    return namespace
