from firebase_functions import https_fn
from validations.db_schama_validator import db_schema_schema

from jsonschema import validate, ValidationError
import json

from ai.db_schema_indexing import create_chunk_and_index
from ai.generate_sql import generate_sql, generate_sql
from ai.delete_namespace import delete_namespace

@https_fn.on_request()
def store_db_schema(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }

        return ("", 204, headers)

    if req.method != 'POST':
        return https_fn.Response(status=405, response="This method is not allowed")
    
    headers = {"Access-Control-Allow-Origin": "genql.neetigya.me"}

    db_schema = req.get_json()['db_schema']
    reference = req.get_json().get('reference', None)

    try:
        validate(instance=db_schema, schema=db_schema_schema)
    except ValidationError as err:
        return https_fn.Response(status=400, response=str(err), headers=headers)

    reference = create_chunk_and_index(db_schema, reference)

    response = {
        "reference": reference
    }

    response = json.dumps(response)

    return https_fn.Response(response, status=201,  mimetype='application/json', headers=headers)


@https_fn.on_request()
def generate_sql_query(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }

        return ("", 204, headers)

    if req.method != 'POST':
        return https_fn.Response(status=405, response="This method is not allowed")
    
    headers = {"Access-Control-Allow-Origin": "*"}
    
    text = req.get_json()['input']
    reference = req.get_json()['reference']

    if len(text) > 10000:
        return https_fn.Response(status=400, response="Max of input can be 10000 characters.", headers=headers)
    
    if len(reference) > 100:
        return https_fn.Response(status=400, response="Max of reference can be 100 characters.", headers=headers)

    results = generate_sql(text, reference)
    sql_query = results['sql']
    search_results = results['search_results']

    response = {
        "result": sql_query,
        "search_results": search_results,
    }

    response = json.dumps(response)

    return https_fn.Response(response, status=200,  mimetype='application/json', headers=headers)


@https_fn.on_request()
def delete_reference(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }

        return ("", 204, headers)

    if req.method != 'POST':
        return https_fn.Response(status=405, response="This method is not allowed")
    
    headers = {"Access-Control-Allow-Origin": "*"}
    
    reference = req.get_json()['reference']

    if len(reference) > 100:
        return https_fn.Response(status=400, response="Max of reference can be 100 characters.", headers=headers)


    try:
        delete_namespace(reference)
    except Exception as e:
        return https_fn.Response(status=500, response=f"Failed to delete namespace: {str(e)}", headers=headers)

    return https_fn.Response( status=200,  mimetype='application/json', headers=headers)


