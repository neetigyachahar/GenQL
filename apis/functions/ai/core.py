from openai import OpenAI
from pinecone import Pinecone


clientOpenAi = OpenAI(
  api_key="[YOUR_OPENAI_API_KEY]",
)


# Function to generate embeddings using OpenAI GPT-3's embeddings model
def get_embedding(text):
    response = clientOpenAi.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding


def vector_db():
  pinecone = Pinecone(api_key="[YOUR_PINECONE_API_KEY]")
  index =  pinecone.Index("db-schema")

  return index
    