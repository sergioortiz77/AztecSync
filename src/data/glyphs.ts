// UBICACIÓN: src/data/glyphs.ts

export interface Glyph {
  id: number;
  name: string;
  meaning: string;
  color: string;
  image: any;       // La portada (Glifo Neón)
  wheelImage: any;  // El puntero (Rueda completa)
}

export const AZTEC_GLYPHS: Glyph[] = [
  { id: 0, name: "Cipactli", meaning: "Caimán", color: "#00FF9D", image: require("../../assets/glyphs/glyph_0.webp"), wheelImage: require("../../assets/wheel/pointer_0.webp") },
  { id: 1, name: "Ehécatl", meaning: "Viento", color: "#00F0FF", image: require("../../assets/glyphs/glyph_1.webp"), wheelImage: require("../../assets/wheel/pointer_1.webp") },
  { id: 2, name: "Calli", meaning: "Casa", color: "#FF0055", image: require("../../assets/glyphs/glyph_2.webp"), wheelImage: require("../../assets/wheel/pointer_2.webp") },
  { id: 3, name: "Cuetzpalin", meaning: "Lagartija", color: "#FFD500", image: require("../../assets/glyphs/glyph_3.webp"), wheelImage: require("../../assets/wheel/pointer_3.webp") },
  { id: 4, name: "Cóatl", meaning: "Serpiente", color: "#FF5500", image: require("../../assets/glyphs/glyph_4.webp"), wheelImage: require("../../assets/wheel/pointer_4.webp") },
  { id: 5, name: "Miquiztli", meaning: "Muerte", color: "#FFFFFF", image: require("../../assets/glyphs/glyph_5.webp"), wheelImage: require("../../assets/wheel/pointer_5.webp") },
  { id: 6, name: "Mázatl", meaning: "Venado", color: "#0099FF", image: require("../../assets/glyphs/glyph_6.webp"), wheelImage: require("../../assets/wheel/pointer_6.webp") },
  { id: 7, name: "Tochtli", meaning: "Conejo", color: "#D4FF00", image: require("../../assets/glyphs/glyph_7.webp"), wheelImage: require("../../assets/wheel/pointer_7.webp") },
  { id: 8, name: "Atl", meaning: "Agua", color: "#00FFFF", image: require("../../assets/glyphs/glyph_8.webp"), wheelImage: require("../../assets/wheel/pointer_8.webp") },
  { id: 9, name: "Itzcuintli", meaning: "Perro", color: "#FFaa00", image: require("../../assets/glyphs/glyph_9.webp"), wheelImage: require("../../assets/wheel/pointer_9.webp") },
  { id: 10, name: "Ozomahtli", meaning: "Mono", color: "#FF00FF", image: require("../../assets/glyphs/glyph_10.webp"), wheelImage: require("../../assets/wheel/pointer_10.webp") },
  { id: 11, name: "Malinalli", meaning: "Hierba", color: "#00FF44", image: require("../../assets/glyphs/glyph_11.webp"), wheelImage: require("../../assets/wheel/pointer_11.webp") },
  { id: 12, name: "Ácatl", meaning: "Caña", color: "#FF3333", image: require("../../assets/glyphs/glyph_12.webp"), wheelImage: require("../../assets/wheel/pointer_12.webp") },
  { id: 13, name: "Ocelótl", meaning: "Jaguar", color: "#FFAA00", image: require("../../assets/glyphs/glyph_13.webp"), wheelImage: require("../../assets/wheel/pointer_13.webp") },
  { id: 14, name: "Cuauhtli", meaning: "Águila", color: "#AA00FF", image: require("../../assets/glyphs/glyph_14.webp"), wheelImage: require("../../assets/wheel/pointer_14.webp") },
  { id: 15, name: "Cozcacuauhtli", meaning: "Buitre", color: "#FF0099", image: require("../../assets/glyphs/glyph_15.webp"), wheelImage: require("../../assets/wheel/pointer_15.webp") },
  { id: 16, name: "Ollin", meaning: "Movimiento", color: "#00CCFF", image: require("../../assets/glyphs/glyph_16.webp"), wheelImage: require("../../assets/wheel/pointer_16.webp") },
  { id: 17, name: "Tecpatl", meaning: "Cuchillo", color: "#CCCCCC", image: require("../../assets/glyphs/glyph_17.webp"), wheelImage: require("../../assets/wheel/pointer_17.webp") },
  { id: 18, name: "Quiáhuitl", meaning: "Lluvia", color: "#0055FF", image: require("../../assets/glyphs/glyph_18.webp"), wheelImage: require("../../assets/wheel/pointer_18.webp") },
  { id: 19, name: "Xóchitl", meaning: "Flor", color: "#FF00CC", image: require("../../assets/glyphs/glyph_19.webp"), wheelImage: require("../../assets/wheel/pointer_19.webp") },
];