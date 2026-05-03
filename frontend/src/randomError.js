const noResultsMessages = [
    "Ups… no encontré nada con esa búsqueda. ¿Quieres intentar con algo diferente?",
    "Parece que no hay resultados 😅 ¿Probamos con otra idea o cambiamos un poco la búsqueda?",
    "No encontré coincidencias esta vez. Pero seguro encontramos algo si ajustamos un poco 😉",
    "Hmm… por aquí está vacío. ¿Qué tal si lo intentamos con otra descripción?",
    "Nada por ahora, pero no te preocupes 🙌 intenta con otro estilo o antojo.",
    "No hubo suerte con esa búsqueda. ¿Quieres que te sugiera algo diferente?",
    "No encontré lugares con eso… pero podemos explorar otras opciones 👀",
    "Esa búsqueda vino tímida, no trajo resultados 😅 ¿probamos otra?",
    "Por ahora no hay coincidencias. ¿Te gustaría intentar algo más general o distinto?",
    "No encontré nada, pero seguro hay algo perfecto si cambiamos un poquito la idea ✨",
    "Aquí no salió nada… pero dime qué ajustamos y seguimos buscando 🔍",
    "Sin resultados esta vez 😬 ¿quieres intentar con otro estilo o tipo de lugar?",
];

export const getRandomNoResultsMessage = () => {
    const index = Math.floor(Math.random() * noResultsMessages.length);
    return noResultsMessages[index];
};
