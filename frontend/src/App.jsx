import { useState } from "react";
import "./App.css";
import { SearchBig } from "@boxicons/react";

export default function App() {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState([]);

    const saludos = [
        "¿Qué se te antoja hoy?",
        "¿En qué puedo ayudarte hoy?",
        "¡Listo para encontrar el lugar ideal!",
        "¿Buscando algo delicioso?",
        "¡Vamos a descubrir nuevos sabores!",
        "¿Tienes antojo de algo en particular?",
        "¡Explora las mejores opciones para ti!",
        "¿Quieres algo rápido o algo más elaborado?",
        "¡Estoy aquí para ayudarte a encontrar el lugar perfecto!",
    ];

    const saludoAleatorio = saludos[Math.floor(Math.random() * saludos.length)];

    const buscar = async () => {
        if (!query) return;

        const res = await fetch("http://localhost:3000/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        const data = await res.json();
        setResultados(data.resultados || []);
    };

    return (
        <div className="main-container">
            <div className="saludo-container">
                <h2 className="saludo">¡Hola!, Bienvenido a Niblo</h2>
                <h4 className="saludo-aleatorio">{saludoAleatorio}</h4>
                {resultados.map((r, i) => (
                    <div key={i}>
                        <p>{r.name}</p>
                        <p>{r.rating}</p>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    className="input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tengo ganas de unos tacos..."
                />
                <button onClick={buscar} className="button-search">
                    <SearchBig
                        pack="unfilled"
                        fill="#ffffff"
                        size="sm"
                        className="search-icon"
                    />
                </button>
            </div>
        </div>
    );
}
