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
Convierte el texto del usuario en filtros para buscar restaurantes.

IMPORTANTE:
- Corrige errores ortográficos
- Entiende sinónimos
- Interpreta intención aunque esté mal escrito
- Responde SOLO con JSON válido
- NO expliques nada

FORMATO OBLIGATORIO:
- Todo en minúsculas
- Sin acentos (ej: "ninos", "rapido")
- Usa "_" en lugar de espacios (ej: "comida_rapida")

Devuelve EXACTAMENTE:

{
    "puntuacion_minima": null, 
    "precio": null, 
    "tipo_comida": [], 
    "productos": [], 
    "ambiente": [],
    "servicios": [], 
    "publico": [], 
    "pagos": [],
    "bebidas": [],
    "accesibilidad": [],
    "abierto": false
}

Valores permitidos:

puntuacion_minima: valor numerico flotante entre 0.0 y 5.0 (ej: 4.5, 3.0, 2.5), si el usuario ingresa puntuaciones de 55, 66, 100, etc., conviertelas a la escala de 0 a 5 (ej: 55 -> 2.75, 66 -> 3.3, 100 -> 5.0)

precio: valor numerico flotante (ej: 200.00, 39.99, 100.00), si el usuario ingresa palabras como "barato", "medio", "caro", conviertelas a un precio (ej: barato -> 150, medio -> 300, caro -> 500)

tipo_comida: [
    "mariscos",
    "cafeteria",
    "restaurante",
    "taqueria",
    "pizzeria",
    "hamburgueseria",
    "comida rápida"
]

productos: [
    "aguachile",
    "ceviche",
    "cocteles",
    "mariscos",
    "desayunos",
    "almuerzos",
    "cena",
    "postres",
    "aperitivos",
    "almuerzo",
    "tacos",
    "bocadillos",
    "vegano",
    "vegetariano",
    "pizza",
    "hamburguesas",
    "pollo_frito", 
    "hamburguesas"
]

ambiente: [
    "informal",
    "relajado",
    "agradable",
    "a_la_moda",
    "romantico"
]

publico: [
    "turistas",
    "grupos",
    "ninos",
    "estudiantes",
    "estacionamiento"
]

pagos: [
    "efectivo",
    "tarjeta_debito",
    "tarjeta_credito",
    "pago_nfc"
]

servicios: [
    "consumo_en_lugar",
    "para_llevar",
    "servicio_a_la_mesa",
    "entrega_a_domicilio",
    "estacionamiento",
    "pedidos_desde_automovil",
    "area_de_juegos_infantiles"
]


bebidas: [
    "cerveza",
    "cocteles",
    "cafe",
    "malteadas",
    "jugos",
    "alcohol",
    "refrescos",
    "frappes"
]

accesibilidad: ["silla_de_ruedas"]

abierto: true o false

Texto del usuario:
"${query}"
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        let text = response.text;

        console.log("Respuesta IA:", text);

        text = text.replace(/```json|```/g, "").trim();

        const parsed = JSON.parse(text);

        return {
            puntuacion_minima: parsed.puntuacion_minima ?? null,
            precio: parsed.precio ?? null,
            tipo_comida: parsed.tipo_comida ?? [],
            productos: parsed.productos ?? [],
            ambiente: parsed.ambiente ?? [],
            servicios: parsed.servicios ?? [],
            publico: parsed.publico ?? [],
            pagos: parsed.pagos ?? [],
            bebidas: parsed.bebidas ?? [],
            abierto: parsed.abierto ?? false,
        };
    } catch (error) {
        console.log("Error Gemini:", error.message);

        return {
            puntuacion_minima: null,
            precio: null,
            tipo_comida: [],
            productos: [],
            ambiente: [],
            servicios: [],
            publico: [],
            pagos: [],
            bebidas: [],
            abierto: false,
        };
    }
}
function buscarRestaurantesMock(filtros) {
    return data
        .map((lugar) => {
            let match = false;

            // ⭐ puntuación
            if (
                filtros.puntuacion_minima &&
                lugar.puntuacion >= filtros.puntuacion_minima
            ) {
                match = true;
            }

            // 💰 precio
            if (
                filtros.precio &&
                lugar.precio &&
                filtros.precio >= lugar.precio.min &&
                filtros.precio <= lugar.precio.max
            ) {
                match = true;
            }

            // 🍽 tipo de comida
            if (
                filtros.tipo_comida?.some((t) => lugar.tipo_comida?.includes(t))
            ) {
                match = true;
            }

            // 🍤 productos
            if (filtros.productos?.some((p) => lugar.productos?.includes(p))) {
                match = true;
            }

            // 🎭 ambiente
            if (filtros.ambiente?.some((a) => lugar.ambiente?.includes(a))) {
                match = true;
            }

            // 🧾 servicios
            if (filtros.servicios?.some((s) => lugar.servicios?.includes(s))) {
                match = true;
            }

            // 👨‍👩‍👧 público
            if (filtros.publico?.some((p) => lugar.publico?.includes(p))) {
                match = true;
            }

            // 💳 pagos
            if (filtros.pagos?.some((p) => lugar.pagos?.includes(p))) {
                match = true;
            }

            // 🍺 bebidas
            if (filtros.bebidas?.some((b) => lugar.bebidas?.includes(b))) {
                match = true;
            }

            // 🟢 abierto
            if (filtros.abierto && lugar.abierto) {
                match = true;
            }

            return match ? lugar : null;
        })
        .filter(Boolean)
        .slice(0, 5);
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
