// RAG settings for the Product module. The upload script and the report both read these, so
// the stored vectors and the search always match. Changing the model or the dimension means
// re-running scripts/upload-product-knowledge.ts.

// 3072 is this model's full size and matches the shared Pinecone index (PINECONE_INDEX).
export const EMBEDDING_MODEL = "text-embedding-3-large";
export const EMBEDDING_DIMENSION = 3072;

// Our vectors live in their own namespace, so other modules' data in the index is never touched.
export const PINECONE_NAMESPACE = "product";

// How many similar scenarios the report is given as examples.
export const TOP_K = 3;
