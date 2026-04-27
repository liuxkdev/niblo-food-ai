export const suggestions = [
    "Quiero tacos baratos cerca de mí",
    "Quiero mariscos en un lugar romántico",
    "Quiero una pizza artesanal para cenar",
    "Quiero un café tranquilo para estudiar",
    "Quiero comida corrida económica",
    "Quiero sushi fresco y barato",
    "Quiero hamburguesas grandes y jugosas",
    "Quiero un restaurante elegante para una cita",
    "Quiero comida mexicana tradicional",
    "Quiero desayunos completos y baratos",
    "Quiero un lugar con terraza para cenar",
    "Quiero comida rápida pero rica",
    "Quiero un buffet económico cerca",
    "Quiero un lugar con ambiente familiar",
];

export const getRandomSuggestion = () => {
    const index = Math.floor(Math.random() * suggestions.length);
    return suggestions[index];
};
