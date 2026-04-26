export async function buscarRestaurantes(query) {
    try {
        const res = await fetch("http://localhost:3000/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });
        
        if (!res.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const data = await res.json();

        return {
            ok: true,
            data,
        };
    } catch (error) {
        console.error("Error al consumir API:", error.message);

        return {
            ok: false,
            error: "No se pudo conectar con el servidor",
        };
    }
}
