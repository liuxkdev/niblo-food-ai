const aiResponse = [
    "He encontrado algunas opciones que encajan con tu descripción:",
    "Te muestro algunas alternativas que podrían gustarte:",
    "Estas son algunas opciones que coinciden con lo que buscas:",
    "Encontré varios lugares que podrían ajustarse a tu idea:",
    "Aquí tienes algunas recomendaciones basadas en tu preferencia:",
    "Estas opciones podrían ser justo lo que estás buscando:",
    "Te dejo algunas sugerencias que encajan con tu estilo:",
    "Esto es lo que encontré que podría gustarte:",
    "Mira estas opciones que se ajustan a tu descripción:",
    "Estas son algunas recomendaciones pensadas para ti:",
    "He seleccionado algunas opciones que podrían funcionarte:",
    "Te comparto estas alternativas que encajan con tu búsqueda:",
    "Esto es lo que mejor coincide con lo que me dijiste:",
    "Aquí tienes algunas ideas que podrían interesarte:",
    "Estas opciones fueron elegidas según tu preferencia:",
];

export const getRandomAIResponse = () => {
    const index = Math.floor(Math.random() * aiResponse.length);
    return aiResponse[index];
};
