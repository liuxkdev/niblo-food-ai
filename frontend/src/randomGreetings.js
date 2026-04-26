export const greetings = [
    "¿Qué te apetece comer hoy?",
    "¿Qué se te antoja hoy?",
    "¿Tienes hambre o solo curiosidad?",
    "¿Qué vas a pedir hoy?",
    "¿Qué quieres comer esta vez?",
    "¿Se te antoja algo rico hoy?",
    "¿Qué traes de antojo?",
    "¿Ya pensaste qué vas a comer?",
    "¿Algo ligero o te vas con todo hoy?",
    "¿Qué delicia buscas hoy?",
    "¿Qué vamos a comer hoy?",
    "¿Qué piensas pedir hoy?",
    "¿Andas con antojo de algo dulce o salado?",
    "¿Qué plan tienes para comer hoy?",
];

export const getRandomGreeting = () => {
    const index = Math.floor(Math.random() * greetings.length);
    return greetings[index];
};
