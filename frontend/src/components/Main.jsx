import { useState, useEffect, useRef } from "react"

export default function Main({ initialImageUrl, onBackToSearch }) {
    const [meme, setMeme] = useState({
        imageUrl: initialImageUrl || "https://i.imgflip.com/1bij.jpg"
    })
    
    const [textBoxes, setTextBoxes] = useState([
        { id: 1, text: "One does not simply", x: 30, y: 30 },
        { id: 2, text: "Walk into Mordor", x: 30, y: 250 }
    ])

    const [draggingId, setDraggingId] = useState(null)
    const dragStart = useRef({ x: 0, y: 0 })
    const containerRef = useRef(null)

    useEffect(() => {
        if (initialImageUrl) {
            setMeme({ imageUrl: initialImageUrl })
        }
    }, [initialImageUrl])
    
    function addTextBox() {
        const newBox = { id: Date.now(), text: "New Text", x: 50, y: 80 }
        setTextBoxes(prev => [...prev, newBox])
    }

    function handleTextChange(id, value) {
        setTextBoxes(prev => prev.map(box => 
            box.id === id ? { ...box, text: value } : box
        ))
    }

    function handleMouseDown(e, id, currentX, currentY) {
        setDraggingId(id)
        dragStart.current = {
            startX: e.clientX,
            startY: e.clientY,
            boxX: currentX,
            boxY: currentY
        }
    }

    function handleMouseMove(e) {
        if (!draggingId || !containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        
        // 1. Force calculation based on the actual dragging element's real-time dimensions
        const textElements = containerRef.current.querySelectorAll('.meme-text');
        let elementWidth = 150;  // Safe fallbacks
        let elementHeight = 40;

        // Map through to find the element that matches our state's position mapping order
        const activeIndex = textBoxes.findIndex(b => b.id === draggingId);
        if (activeIndex !== -1 && textElements[activeIndex]) {
            elementWidth = textElements[activeIndex].clientWidth;
            elementHeight = textElements[activeIndex].clientHeight;
        }

        const deltaX = e.clientX - dragStart.current.startX
        const deltaY = e.clientY - dragStart.current.startY

        let newX = dragStart.current.boxX + deltaX
        let newY = dragStart.current.boxY + deltaY

        // 2. Strict boundary checks that will never glitch out when mouse moves fast
        newX = Math.max(0, Math.min(newX, rect.width - elementWidth)) 
        newY = Math.max(0, Math.min(newY, rect.height - elementHeight))

        setTextBoxes(prev => prev.map(box => 
            box.id === draggingId ? { ...box, x: newX, y: newY } : box
        ))
    }

    function handleMouseUp() {
        setDraggingId(null)
    }


    async function downloadMeme() {
        if (!containerRef.current) return;

        // 1. Find the image element inside your container
        const imgElement = containerRef.current.querySelector("img");
        if (!imgElement) return;

        // 2. Create a hidden canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // 3. Set canvas dimensions to match the actual image size
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;

        // 4. Draw the background meme image
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

        // Calculate scaling factors if the image is resized by CSS on your screen
        const scaleX = canvas.width / imgElement.clientWidth;
        const scaleY = canvas.height / imgElement.clientHeight;

        // 5. Draw each text box onto the canvas
        textBoxes.forEach((box) => {
            // Configure font styles to match your CSS precisely
            ctx.font = `bold ${28 * scaleY}px Impact`;
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2 * scaleY;
            ctx.textBaseline = "top";

            // Calculate positions scaled to original image dimensions
            const xPos = box.x * scaleX;
            const yPos = box.y * scaleY;
            const textValue = box.text.toUpperCase(); // Force classic meme uppercase

            // Draw the outline first, then fill the white text
            ctx.strokeText(textValue, xPos, yPos);
            ctx.fillText(textValue, xPos, yPos);
        });

        // 6. Trigger the browser download link
        const link = document.createElement("a");
        link.download = "my-meme.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    // Prefix the original image URL with a CORS proxy to bypass browser blocking safely
    const safeImageUrl = `http://localhost:5000/api/proxy-image?url=${encodeURIComponent(meme.imageUrl)}`;

    // const BACKEND_URL = "https://pakbungdesu-meme-generator-backend.hf.space";
    // const safeImageUrl = `${BACKEND_URL}/api/proxy-image?url=${encodeURIComponent(meme.imageUrl)}`;

    return (
        <main onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            {onBackToSearch && (
                <button type="button" onClick={onBackToSearch} className="back-button">
                    ⬅️ Back to Search
                </button>
            )}

            <div className="form">
                {textBoxes.map((box, index) => (
                    <label key={box.id}>Text Box {index + 1}
                        <input
                            type="text"
                            value={box.text}
                            onChange={(e) => handleTextChange(box.id, e.target.value)}
                        />
                    </label>
                ))}
                
                <button type="button" onClick={addTextBox} className="add-btn">
                    Add Text Box 
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>

                <button type="button" onClick={downloadMeme} className="download-btn">
                    Download Meme 💾
                </button>
            </div>

            <div 
                className="meme" 
                ref={containerRef} 
                style={{ position: "relative", display: "inline-block", WebkitUserSelect: "none", userSelect: "none" }}
            >
                <img src={safeImageUrl} alt="Meme" crossOrigin="anonymous" draggable="false" style={{ display: "block" }} />
                
                {textBoxes.map(box => (
                    <span 
                        key={box.id}
                        className="meme-text"
                        onMouseDown={(e) => handleMouseDown(e, box.id, box.x, box.y)}
                        style={{
                            position: "absolute",
                            left: `${box.x}px`,
                            top: `${box.y}px`,
                            cursor: "move",
                            userSelect: "none",
                            whiteSpace: "nowrap",
                            fontWeight: "bold",
                            fontSize: "28px",
                            fontFamily: "Impact, sans-serif",
                            textTransform: "uppercase",
                            color: "white",
                            textShadow: `
                                -2px -2px 0 #000,  
                                 2px -2px 0 #000,
                                -2px  2px 0 #000,
                                 2px  2px 0 #000,
                                -2px  0px 0 #000,
                                 2px  0px 0 #000,
                                 0px -2px 0 #000,
                                 0px  2px 0 #000
                            `
                        }}
                    >
                        {box.text}
                    </span>
                ))}
            </div>
        </main>
    )
}