import { useState, useEffect, useRef } from "react";
import { buscarRestaurantes } from "./services/api";
import { getRandomGreeting } from "./randomGreetings";
import { getRandomDescription } from "./randomDesc";
import { getRandomAIResponse } from "./randomAIResponse";

export default function App() {
    const [messages, setMessages] = useState([]); // Estado de mensajes
    const [prompt, setPrompt] = useState(""); // Estado de prompt
    const [randomGreeting, setRandomGreeting] = useState(getRandomGreeting()); // Estado de saludo aleatorio
    const [randomDesc, setRandomDesc] = useState(getRandomDescription); // Estado de descripción aleatoria
    const [randomAIResponse, setRandomAIResponse] =
        useState(getRandomAIResponse); // Estado de respuesta IA
    const [isChatActive, setIsChatActive] = useState(false); // Estado del chat
    const messageEndRef = useRef(null);

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
            content: randomAIResponse,
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
        setRandomAIResponse(getRandomAIResponse());
        setIsChatActive(true); // Actualizar estado del chat
    };

    const clearChat = () => {
        setMessages([]); // Vaciar el chat
        setRandomGreeting(getRandomGreeting()); // Generar un saludo diferente
        setRandomDesc(getRandomDescription()); // Generar una descripción diferente
        setIsChatActive(false); // Actualizar estado del chat
    };

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <>
            <h2>{randomGreeting}</h2>

            <p>{randomDesc}</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </form>
            {isChatActive && <button onClick={clearChat}>Vaciar Chat</button>}

            {messages.map((msg) => (
                <div key={msg.id}>
                    {msg.role === "user" && <p>Usuario: {msg.content}</p>}

                    {msg.role === "assistant" && msg.isTyping && <p>...</p>}
                    {msg.role === "assistant" &&
                        !msg.isTyping &&
                        msg.content && <p>Respuesta: {msg.content}</p>}

                    {msg.role === "assistant" &&
                        msg.results &&
                        msg.results.map((r, i) => (
                            <div key={i}>
                                <p>{r.nombre}</p>
                            </div>
                        ))}
                </div>
            ))}
            <div ref={messageEndRef}></div>
        </>
    );
}
