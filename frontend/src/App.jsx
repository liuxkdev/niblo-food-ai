import { useState, useEffect, useRef } from "react";
import { buscarRestaurantes } from "./services/api";
import { getRandomGreeting } from "./randomGreetings";
import { getRandomDescription } from "./randomDesc";
import { getRandomAIResponse } from "./randomAIResponse";
import { AnimatePresence, motion } from "framer-motion";
import "./style.css";
import { Trash, Star, Search, Send } from "@boxicons/react";
import { getRandomSuggestion } from "./randomSug";

export default function App() {
    const [messages, setMessages] = useState([]); // Estado de mensajes
    const [prompt, setPrompt] = useState(""); // Estado de prompt
    const [randomGreeting, setRandomGreeting] = useState(getRandomGreeting()); // Estado de saludo aleatorio
    const [randomDesc, setRandomDesc] = useState(getRandomDescription()); // Estado de descripción aleatoria
    const [randomSuggestion, setRandomSuggestion] = useState(getRandomSuggestion())
    const [isChatActive, setIsChatActive] = useState(false); // Estado del chat
    const messageEndRef = useRef(null);
    const inputRef = useRef(null);

    const [show, setShow] = useState(true);

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
            content: getRandomAIResponse(),
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

    const isTyping = messages.some((m) => m.isTyping);
    return (
        <div className="h-dvh bg-gray-100 text-gray-900 font-sans flex flex-col items-center selection:bg-orange-500/30 overflow-hidden relative">
            <AnimatePresence>
                {isChatActive && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-4 right-4 "
                    >
                        <button
                            onClick={clearChat}
                            className="font-monts bg-white py-2 px-4 rounded-full flex text-sm items-center gap-1 text-gray-500 shadow-md"
                        >
                            <Trash pack="unfilled" size="sm" />
                            Vaciar chat
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <motion.div
                layout
                className={`w-full max-w-3xl px-4 flex flex-col h-full ${
                    isChatActive ? "pt-24 pb-6 md:pb-8" : "justify-center"
                }`}
                initial={false}
                transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
            >
                <motion.div
                    layout
                    className={`w-full flex flex-col ${isChatActive ? "flex-1 overflow-y-auto no-scrollbar" : ""}`}
                    style={{ scrollbarWidth: "none" }}
                >
                    <div className="w-full flex flex-col no-scrollbar pb-2">
                        <AnimatePresence mode="wait">
                            {!isChatActive ? (
                                <motion.div
                                    key="greeting"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{
                                        opacity: 0,
                                        y: -20,
                                        filter: "blur(10px)",
                                    }}
                                    transition={{ duration: 0.4 }}
                                    className="text-center"
                                >
                                    <div className="flex justify-center">
                                        <div className="w-12 h-12">
                                            <img
                                                src="/icon64x64transparent.png"
                                                alt="niblo logo"
                                            />
                                        </div>
                                    </div>
                                    <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3 font-monts">
                                        {randomGreeting}
                                    </h1>
                                    <p className="text-gray-500 text-lg max-w-lg mx-auto font-monts">
                                        {randomDesc}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="chat-history"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full flex flex-col gap-8"
                                >
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="w-full"
                                        >
                                            {msg.role === "user" ? (
                                                <div className="flex justify-end w-full">
                                                    <div className="bg-white px-5 py-3 rounded-2xl max-w-[85%] text-gray-800 text-lg border border-gray-100 shadow-sm whitespace-pre-wrap">
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full flex flex-col gap-6">
                                                    <div className=" flex gap-4 items-start">
                                                        <div className="w-8 h-8 rounded-full">
                                                            <img
                                                                src="/icon64x64transparent.png"
                                                                alt="icon niblo"
                                                            />
                                                        </div>
                                                        {msg.isTyping ? (
                                                            <div className="flex gap-1.5 items-center h-10">
                                                                <motion.div
                                                                    animate={{
                                                                        scale: [
                                                                            1,
                                                                            1.2,
                                                                            1,
                                                                        ],
                                                                    }}
                                                                    transition={{
                                                                        repeat: Infinity,
                                                                        duration: 1,
                                                                    }}
                                                                    className="w-2 h-2 rounded-full bg-gray-400"
                                                                />
                                                                <motion.div
                                                                    animate={{
                                                                        scale: [
                                                                            1,
                                                                            1.2,
                                                                            1,
                                                                        ],
                                                                    }}
                                                                    transition={{
                                                                        repeat: Infinity,
                                                                        duration: 1,
                                                                        delay: 0.2,
                                                                    }}
                                                                    className="w-2 h-2 rounded-full bg-gray-400"
                                                                />
                                                                <motion.div
                                                                    animate={{
                                                                        scale: [
                                                                            1,
                                                                            1.2,
                                                                            1,
                                                                        ],
                                                                    }}
                                                                    transition={{
                                                                        repeat: Infinity,
                                                                        duration: 1,
                                                                        delay: 0.4,
                                                                    }}
                                                                    className="w-2 h-2 rounded-full bg-gray-400"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-700 text-lg pt-1">
                                                                {msg.content}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {msg.results &&
                                                        msg.results.length >
                                                            0 && (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pl-12 relative z-20">
                                                                {msg.results.map(
                                                                    (
                                                                        restaurant,
                                                                        rIndex,
                                                                    ) => (
                                                                        <motion.div
                                                                            key={`${msg.id}-${restaurant.id}`}
                                                                            initial={{
                                                                                opacity: 0,
                                                                                scale: 0.95,
                                                                                y: 20,
                                                                            }}
                                                                            animate={{
                                                                                opacity: 1,
                                                                                scale: 1,
                                                                                y: 0,
                                                                            }}
                                                                            transition={{
                                                                                type: "spring",
                                                                                bounce: 0.2,
                                                                                duration: 0.6,
                                                                                delay:
                                                                                    rIndex *
                                                                                    0.1,
                                                                            }}
                                                                            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-orange-500/40 transition-colors cursor-pointer flex flex-col shadow-sm hover:shadow-md"
                                                                        >
                                                                            <div className="relative h-44 overflow-hidden">
                                                                                <img
                                                                                    src={
                                                                                        restaurant.img
                                                                                    }
                                                                                    alt={
                                                                                        restaurant.nombre
                                                                                    }
                                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                                />
                                                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-black/5 shadow-sm">
                                                                                    <Star
                                                                                        pack="unfilled"
                                                                                        size="sm"
                                                                                    />
                                                                                    <span className="text-sm font-medium text-gray-900">
                                                                                        {
                                                                                            restaurant.puntuacion
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                    <div ref={messageEndRef}></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.div
                    layout
                    className={`w-full relative z-10 shrink-0 ${isChatActive ? "pt-10" : "pt-8"}`}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
                >
                    <form
                        onSubmit={handleSubmit}
                        className={`relative flex items-center bg-white rounded-3xl border transition-colors duration-300 pl-4 ${
                            isChatActive
                                ? "border-gray-200 shadow-md focus-within:border-orange-500/50 focus-within:shadow-lg"
                                : "border-gray-200 focus-within:border-orange-500/50 shadow-sm"
                        }`}
                    >
                    <Search className="text-gray-400"/>
                        <input
                            ref={inputRef}
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={`Ej: ${randomSuggestion}`}
                            disabled={isTyping}
                            className="w-full bg-transparent py-4 pl-6 pr-14 text-gray-900 placeholder-gray-400 focus:outline-none text-lg rounded-lg disabled:opacity-50 overflow-hidden text-ellipsis"
                        />
                        <AnimatePresence>
                            {prompt.trim() && !isTyping && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    type="submit"
                                    className="absolute right-3 w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-sm"
                                >
                                    <Send/>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
}
