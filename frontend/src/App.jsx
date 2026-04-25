import { useState } from "react";
import "./App.css";
import { SearchBig } from "@boxicons/react";

export default function App() {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

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

    const sugerencias = [
        "Comida mexicana",
        "Café y postres",
        "Mariscos",
        "Hamburguesas",
    ];

    const saludoAleatorio = saludos[Math.floor(Math.random() * saludos.length)];

    const buscar = async (texto) => {
        const q = texto || query;
        if (!q) return;

        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: q }),
            });

            const data = await res.json();
            setResultados(data.resultados || []);
            setError(false);
        } catch (err) {
            console.error("Error:", err);
            setError(true);
        }

        setLoading(false);
    };

    const hayResultados = resultados.length > 0;
    const modoActivo = loading || error || hayResultados;

    return (
        <>
            <div className="main-container">
                <header className="header-logo">
                    <img
                        src="./public/icon64x64transparent.png"
                        alt="Niblo Logo"
                    />
                    <h4>Niblo Food AI</h4>
                </header>
                <div
                    className={`body-wrapper ${modoActivo ? "results-wrapper" : ""}`}
                >
                    {loading ? (
                        <div className="loader-container">
                            <h2 className="loader">
                                <span></span>
                                <span></span>
                                <span></span>
                            </h2>
                        </div>
                    ) : error ? (
                        <div className="saludo-container results-container">
                            <h2 className="error">
                                Ocurrió un error al buscar resultados. Intenta
                                de nuevo.
                            </h2>
                        </div>
                    ) : resultados.length > 0 ? (
                        <div className="results-container">
                            {resultados.map((r, i) => (
                                <div key={i} className="result-card">
                                    <p>{r.name}</p>
                                    <p>{r.rating}</p>
                                </div>
                            ))}
                            <div className="result-card">
                                <p>name</p>
                                <p>raiting</p>
                            </div>
                            <div className="result-card">
                                <p>name</p>
                                <p>raiting</p>
                            </div>
                            <div className="result-card">
                                <p>name</p>
                                <p>raiting</p>
                            </div>
                        </div>
                    ) : (
                        <div className="saludo-container">
                            <h2 className="saludo">
                                ¡Hola!, Bienvenido a Niblo
                            </h2>
                            <h4 className="saludo-aleatorio">
                                {saludoAleatorio}
                            </h4>
                        </div>
                    )}
                    <div
                        className={`input-wrapper ${modoActivo ? "input-wrapper-active" : ""}`}
                    >
                        <div
                            className="input-container"
                            style={modoActivo ? { marginBottom: "0" } : {}}
                        >
                            <input
                                value={query}
                                className="input"
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Tengo ganas de unos tacos..."
                            />

                            <button
                                onClick={() => buscar()}
                                className="button-search"
                            >
                                <SearchBig
                                    pack="unfilled"
                                    fill="#ffffff"
                                    size="sm"
                                    className="search-icon"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="sugerencias-container">
                        <div className="sugerencias-wrapper">
                            {sugerencias.map((s, i) => (
                                <button
                                    key={i}
                                    className="sugerencia"
                                    onClick={() => {
                                        setQuery(s);
                                        buscar(s);
                                    }}
                                    style={
                                        modoActivo ? { display: "none" } : {}
                                    }
                                >
                                    <span>{s}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
