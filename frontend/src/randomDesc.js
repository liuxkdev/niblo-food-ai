const descriptions = [
    "Descríbeme lo que buscas. ¿Un ambiente romántico, comida picante, o quizás una terraza tranquila con vistas?",
    "Cuéntame qué tienes en mente: algo elegante, relajado o lleno de sabor intenso.",
    "¿Qué tipo de experiencia quieres hoy? Algo tranquilo, divertido o más sofisticado.",
    "Dime tu mood: ¿romántico, aventurero o algo casual con buena comida?",
    "¿Buscas un lugar con buena vibra, comida picante o una experiencia más chill?",
    "Descríbeme tu plan ideal: una cena especial, algo rápido o un lugar para relajarte.",
    "¿Qué te gustaría hoy? Un ambiente tranquilo, algo moderno o una explosión de sabores.",
    "Cuéntame cómo quieres sentirte: relajado, emocionado o consentido con buena comida.",
    "¿Prefieres algo romántico, casual o un lugar con mucha energía?",
    "Dime tu idea perfecta: buena comida, buen ambiente o simplemente algo diferente.",
    "¿Qué estás buscando hoy? Una experiencia tranquila o algo más vibrante?",
    "Descríbeme tu antojo: comida, ambiente o una combinación de ambos.",
    "¿Quieres algo elegante, relajado o con un toque especial?",
    "Cuéntame tu plan ideal para comer hoy y te ayudo a encontrarlo.",
    "¿Qué tipo de lugar te apetece hoy? Algo íntimo, divertido o con buena vista?",
];

export const getRandomDescription = () => {
    const index = Math.floor(Math.random() * descriptions.length);
    return descriptions[index];
};
