import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function interpretarTexto(query) {
    const prompt = `
Eres un sistema que convierte texto en filtros.

Devuelve SOLO un JSON válido con estas claves:
- tipo_comida (mexican, sushi, pizza, seafood, cafe)
- precio (barato, medio, caro o null)
- abierto_ahora (true o false)

Texto: "${query}"
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        let text = response.text;

        console.log("Respuesta IA:", text);

        text = text.replace(/```json|```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.log("Error Gemini:", error.message);

        return {
            tipo_comida: null,
            precio: null,
            abierto_ahora: false,
        };
    }
}

function mapPrecio(precio) {
    if (precio === "barato") return 1;
    if (precio === "medio") return 2;
    if (precio === "caro") return 3;
    return null;
}

function mapTipo(tipo) {
    const mapa = {
        mexican: ["mexican", "tacos"],
        sushi: ["sushi"],
        pizza: ["pizza"],
        seafood: ["seafood"],
        cafe: ["cafe"],
    };

    return mapa[tipo] || [tipo];
}

function buscarRestaurantesMock(filtros) {
    let resultados = data || [];

    if (filtros.tipo_comida) {
        const tiposValidos = mapTipo(filtros.tipo_comida);

        resultados = resultados.filter((r) =>
            r.types?.some((t) => tiposValidos.includes(t)),
        );
    }

    if (filtros.abierto_ahora) {
        resultados = resultados.filter(
            (r) => r.opening_hours?.open_now === true,
        );
    }

    if (filtros.precio) {
        const nivel = mapPrecio(filtros.precio);

        resultados = resultados.filter((r) => r.price_level === nivel);
    }

    resultados.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return resultados.slice(0, 5);
}

app.post("/search", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: "Falta query" });
        }

        const filtros = await interpretarTexto(query);
        const resultados = buscarRestaurantesMock(filtros);

        res.json({
            filtros,
            total: resultados.length,
            resultados,
        });
    } catch (error) {
        console.error("Error en /search:", error);

        res.status(500).json({
            error: "Error interno del servidor",
        });
    }
});

app.get("/", (req, res) => {
    res.send("API funcionando correctamente");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
