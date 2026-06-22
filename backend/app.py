import os
import torch
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


embedder = SentenceTransformer("./my_local_model")
corpus_embeddings = torch.load("corpus_embeddings.pt")

with open("meme_data.json", "r") as f:
    meme_data = json.load(f)

class SearchRequest(BaseModel):
    query: str
    top_k: int = 3

@app.post("/search")
def search_memes_api(request: SearchRequest):
    query_embedding = embedder.encode(request.query, convert_to_tensor=True)
    cos_scores = util.cos_sim(query_embedding, corpus_embeddings)[0]
    
    top_results = torch.topk(cos_scores, k=min(request.top_k, len(meme_data)))
    
    results = []
    for score, idx in zip(top_results.values, top_results.indices):
        meme = meme_data[idx]
        results.append({
            "score": float(score.item()),
            "file": meme["file"],
            "title": meme["title"],
            "caption": meme["caption"]
        })
        
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)