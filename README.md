

# 🎬 Meme Generator with Semantic Search

A full-stack meme generator application featuring drag-and-drop text customizability and an advanced backend search pipeline.

---

## 🛠️ Tech Stack
* **Frontend:** React, JavaScript (JSX), HTML5 Canvas
* **Backend Utilities:** Node.js (Express & Axios Proxy), Python (Data Scraping & ML Embedding Notebooks)

---

## 📐 Project Architecture

```text
MEME-GENERATOR/
├── .gitignore              # Main root rules (ignores local virtual envs)
├── backend/                # Python processing & local server core
│   ├── images/             # Local processing assets
│   ├── meme_data.json      # Scraped database of top 1,000 templates
│   ├── server.js           # Node.js CORS proxy server (Port 5000)
│  
└── frontend/               # React client framework
    ├── src/                # Component core (Main.jsx, Search.jsx)
    └── public/             # Main index layouts and entry styles

```

---

## 🚀 How It Works

### 1. Web Scraping & AI Data Modeling

* The Python backend script extracts the top **1,000 most popular meme templates** dynamically from web pages, bypassing standard API thresholds.
* Image components are mapped using a local machine-learning vision model inside Jupyter Notebook to establish clean data profiles.

### 2. Node.js Local Proxy Server

* Imgflip restricts image canvas pixel manipulations via browser CORS security policies.
* To bypass this, a local **Node.js proxy server** runs on **Port 5000**. It safely requests template assets server-to-server and streams clean binary feeds back to the client interface.

### 3. Canvas Client Rendering

* Text blocks feature strict boundary locking logic that recalculates boundaries dynamically based on real-time text widths, ensuring text never overflows the template borders.
* Clicking **Download Meme** compiles the image matrix on an isolated HTML5 canvas instance for safe browser downloads.

Here is an updated, detailed section you can add to your `README.md` to explain how your AI-driven semantic search pipeline works under the hood.

---

## 🧠 AI Semantic Search Pipeline Explained

Instead of matching exact keywords (like a basic search bar), this application uses **Machine Learning** to understand the actual *meaning* and *visual context* of memes.

### 1. Visual Understanding (Salesforce BLIP VLM)

A **Vision-Language Model (VLM)** bridges the gap between images and text.

* **The Model (`BLIP-base`):** The application uses Salesforce's BLIP model. It functions like an AI eye that scans your `images/` directory.
* **The Processor:** Converts raw pixels from files (like `10-Guy.jpg`) into a numerical format the AI can interpret.
* **The Generation:** The model generates a descriptive string of what it literally "sees" inside the template asset (e.g., *“a young man with messy hair looking dazed or smiling”*). This generated context is saved into your database records.

### 2. Vector Contextualization (SentenceTransformers)

Once your images are translated into text descriptions, a language embedding model (`all-MiniLM-L6-v2`) turns those descriptions into **vector coordinates**.

* **Semantic Combination:** The pipeline merges the template title and the VLM visual description into a singular search string:
```text
"Distracted Boyfriend. Description: a man looking at another woman while his girlfriend looks angry."

```


* **High-Dimensional Vector Space:** The model transforms that sentence into a dense numerical mathematical representation (an embedding vector). This positions memes with similar *meanings* or *vibes* close to each other in a virtual coordinate map.

### 3. Real-Time Semantic Matching

When a user types a natural sentence into the search bar (e.g., *"unfaithful partner"*), the backend processes it on the fly:

1. **Query Encoding:** The user's text query is instantly converted into its own vector coordinate by the sentence transformer.
2. **Cosine Similarity (`util.cos_sim`):** The engine measures the angular distance between the query vector and your entire 1,000+ template library matrix. It checks how close they are in meaning.
3. **Torch Top-K Sorting:** `torch.topk` extracts the top results with the highest mathematical match score, serving up relevant templates—even if the user's query didn't match a single word in the actual meme title!

---

## 🔧 Installation & Setup

Open three separate terminals to run the ecosystem simultaneously:

### Run the Python Backend API
```bash
cd backend
# Activate your virtual environment (Windows PowerShell)
.venv\Scripts\Activate.ps1
python app.py

```

### Run the Backend Proxy Server

```bash
cd backend
npm install express axios
node server.js

```

### Run the Frontend React Interface

```bash
cd frontend
npm install
npm start

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to view and generate memes!
