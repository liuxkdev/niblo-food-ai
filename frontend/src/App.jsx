import { useState } from "react";
import { buscarRestaurantes } from "./services/api";

import { useEffect } from "react";

export default function App() {
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");

// Código para simular respuestas para diseño de la interfaz

    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((json) => {
                setData(json);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!prompt.trim()) return;

        const userMsg = {
            id: Date.now(),
            role: "user",
            content: prompt,
        };

        const aiMsg = {
            id: Date.now() + 1,
            role: "assistant",
            isTyping: true,
        };

        setMessages((prev) => [...prev, userMsg, aiMsg]);

        const currentPrompt = prompt;
        setPrompt("");

        setTimeout(() => {
            const resultados = data;

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === aiMsg.id
                        ? {
                            ...msg,
                            isTyping: false,
                            results: resultados,
                        }
                        : msg,
                ),
            );
        }, 1000);

        /*  e.preventDefault();

        if (!prompt.trim()) return;

        const userMsg = {
            id: Date.now(),
            role: "user",
            content: prompt,
        };

        const aiMsg = {
            id: Date.now() + 1,
            role: "assistant",
            isTyping: true,
        };

        setMessages((prev) => [...prev, userMsg, aiMsg]);

        const currentPrompt = prompt;
        setPrompt("");

        const response = await buscarRestaurantes(currentPrompt);

        console.log("Respuesta API:", response);
        console.log(response.ok, response.data);

        setMessages((prev) =>
            prev.map((msg) => {
                if (msg.id !== aiMsg.id) return msg;

                if (!response.ok) {
                    return {
                        ...msg,
                        isTyping: false,
                        content: "Error al buscar resultados",
                    };
                }

                return {
                    ...msg,
                    isTyping: false,
                    results: response.data.resultados || [],
                };
            }),
        );
        */
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </form>

            {messages.map((msg) => (
                <div key={msg.id}>
                    {msg.role === "user" && <p>{msg.content}</p>}

                    {msg.role === "assistant" && msg.isTyping && <p>...</p>}

                    {msg.role === "assistant" &&
                        !msg.isTyping &&
                        msg.content && <p>{msg.content}</p>}

                    {msg.role === "assistant" &&
                        msg.results &&
                        msg.results.map((r, i) => (
                            <div key={i}>
                                <p>{r.nombre}</p>
                            </div>
                        ))}
                </div>
            ))}
        </>
    );
}
