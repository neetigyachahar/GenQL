from ai.core import vector_db  

def delete_namespace(namespace):
    index = vector_db()
    index.delete(delete_all=True, namespace=namespace)
