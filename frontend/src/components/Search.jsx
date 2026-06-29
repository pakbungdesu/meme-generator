import React from 'react'


export default function Search({ onSelectImage }){
    const [loading, setLoading] = React.useState(false)
    const [toggle, setToggle] = React.useState(false)
    const [results, setResults] = React.useState([])


    async function queryData(formData) {
        const query = formData.get("query")
        setLoading(true)

        const BACKEND_URL ='http://localhost:8000/search'
        // const BACKEND_URL = "https://pakbungdesu-meme-generator-backend.hf.space";

        try {
            // Updated endpoint to use your production Hugging Face Space
            const response = await fetch(`${BACKEND_URL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query, top_k: 5 }), 
            });
            
            const data = await response.json();
            setResults(data.results || []);
            setToggle(true);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching memes:", error);
            setLoading(false);
        }
    }

    return (
        <main>
            <h2>Search for memes 🖼️</h2>
            <form action={queryData} className="form">
                    <input
                        type="text"
                        placeholder="e.g. A cat is about to throw up"
                        aria-label="Query"
                        name="query"
                    />
                <button disabled={loading} style={{ background: loading ? "#9ca3af" : "#A818DA" }} type="submit">
                    {loading? 'Searching...' : 'Search'}
                </button>
            </form>
            {toggle && <div className="results">
                <h2>Memes you might like: </h2>
                {results.map((meme, index) => (
                <div key={index} style={{ 'marginBottom': '25px' }}>
                    <h3>{meme.title}</h3>

                    <div 
                        onClick={() => onSelectImage(meme.url)} 
                        style={{ cursor: 'pointer' }}
                        title="Click to edit this meme"
                    >
                        <img src={meme.url} alt={meme.title} />
                    </div>
                </div>
                ))}
            </div>}
        </main>
    )
}