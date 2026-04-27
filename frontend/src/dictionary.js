export const dictionary = {
    tipo_comida: {
        pizzeria: "Pizzería",
        mariscos: "Mariscos",
        cafeteria: "Cafetería",
        restaurante: "Restaurante",
        taqueria: "Taquería",
        hamburgueseria: "Hamburguesería",
        comida_rapida: "Comida rápida",
    },

    productos: {
        aguachile: "Aguachile",
        ceviche: "Ceviche",
        cocteles: "Cocteles",
        tacos: "Tacos",
        pizza: "Pizza",
        hamburguesas: "Hamburguesas",
        postres: "Postres",
    },

    ambiente: {
        informal: "Informal",
        relajado: "Relajado",
        romantico: "Romántico",
        a_la_moda: "A la moda",
        agradable: "Agradable",
    },
};

export function formatValue(type, value) {
    return dictionary[type]?.[value] || value;
}