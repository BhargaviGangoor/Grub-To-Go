/** Maps frontend dish titles to backend menu IDs for agent DOM targeting. */
export const DISH_ID_BY_TITLE: Record<string, string> = {
  Croissant: "fr-001",
  "Pain au Chocolat": "fr-002",
  "Pain aux Raisins": "fr-003",
  Brioche: "fr-004",
  "Chausson aux Pommes": "fr-005",
  "Tartine Beurre et Confiture": "fr-006",
  "Tartine au Fromage": "fr-007",
  "Assiette de Fromages": "fr-008",
  "Assiette de Charcuterie": "fr-009",
  "Salade Niçoise": "fr-010",
  "Salade de Chèvre Chaud": "fr-011",
  "Quiche Lorraine": "fr-012",
  "Croque Monsieur": "fr-013",
  "Croque Madame": "fr-014",
  "Soupe à l'Oignon Gratinée": "fr-015",
  "Potage du Jour": "fr-016",
  Ratatouille: "fr-017",
  "Tarte Tatin": "fr-018",
  "Crème Brûlée": "fr-019",
  "Mousse au Chocolat": "fr-020",
  Madeleines: "fr-021",
  "Éclair au Café/Chocolat": "fr-022",
  "Café au Lait": "fr-023",
  Espresso: "fr-024",
  "Chocolat Chaud": "fr-025",
  "Thé": "fr-026",
  "Jus d'Orange Pressé": "fr-027",
  "Vin Maison": "fr-028",
};

export function resolveDishId(title?: string, dishId?: string): string | undefined {
  if (dishId) return dishId;
  if (title) return DISH_ID_BY_TITLE[title];
  return undefined;
}
