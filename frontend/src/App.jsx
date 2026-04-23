import { useState } from "react";

export default function App() {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState([]);

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
        <div>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="buscar comida..."
            />

            <button onClick={buscar}>buscar</button>

            <div>
                {resultados.map((r, i) => (
                    <div key={i}>
                        <p>{r.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
