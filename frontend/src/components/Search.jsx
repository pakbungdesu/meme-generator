import React from 'react'


export default function Search({ onSelectImage }){
    const [loading, setLoading] = React.useState(false)
    const [toggle, setToggle] = React.useState(false)
    const [results, setResults] = React.useState([])


    async function queryData(formData) {
        const query = formData.get("query")
        setLoading(true)

        try {
            const response = await fetch('http://localhost:8000/search', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query, top_k: 3 }), 
            });
            
            const data = await response.json();
            setResults(data.results);
            setToggle(true);
            setLoading(false);
            } catch (error) {
                console.error("Error fetching memes:", error);
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
                <button disabled={loading}>
                    {loading? 'Searching...' : 'Search'}
                </button>
            </form>
            {toggle && <div className="results">
                <h2>Memes you might like: </h2>
                {results.map((meme, index) => (
                <div key={index} style={{ 'margin-bottom': '25px' }}>
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