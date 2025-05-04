from ai.core import get_embedding, clientOpenAi, vector_db  

def vector_search(text, namespace):
    threshold=0.5

    index = vector_db()

    query_embedding = get_embedding(f"Tables for the data that is present in the text: '{text}'")

    response = index.query(
        namespace=namespace,
        vector=query_embedding,
        top_k=10,
        include_metadata=True,
    )

    relevant_tables = []

    for match in response['matches']:
        score = match['score']
        if score > threshold:
            relevant_tables.append({
                'table_name': match['id'],
                'description': match['metadata']['description'],
                'score': score
            })

    return relevant_tables


def prompt_llm(vector_results, text):
    schema_context=' \n '.join(list(map(lambda x: x['description'], vector_results)))

    prompt = f"""
    I want to create a tool which can convert natural language to SQL query. I have provided you the database schema below.

    {schema_context}

    Only using the given schema and not assuming any assumptions, i want to generate SQL Query for progress for the following text provided by the user in natural launguage.

    user provided text: "{text}".

    Make sure to directly give SQL without any other text or quote around the query and do not use newline in the string. basically do not format the SQL query. This output has to be directly passed to a SQL engine.
    """

    # If you think you do not have enough data to produce the SQL query, then simply say "Not enough data". Do not assume any new fact. Do not hallucinate.

    response = clientOpenAi.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a SQL expert. You have to provide SQL query based on the text given by user and the database schema."},
            {"role": "user", "content": prompt}
        ]
    )

    sql_query = response.choices[0].message.content.strip().replace("\n", " ")
    sql_query = sql_query.replace("  ", " ")

    return sql_query



def generate_sql(text, reference):
    vector_results = vector_search(text, reference)

    sql_query = prompt_llm(vector_results, text)

    vector_results = [ {key: value for key, value in x.items() if key != "description"} for x in vector_results ]

    # search_results
    return {
        'search_results': vector_results,
        'sql': sql_query,
    }
