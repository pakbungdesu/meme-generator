import catFace from "../images/cat.png"

export default function Header() {
    return (
        <header className="header">
            <img 
                src={catFace} 
                alt="Cat Face"
            />
            <h1>Meme Generator</h1>
        </header>
    )
}