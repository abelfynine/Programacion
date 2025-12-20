// Define la estructura (tipado) que debe tener un artículos
export type Article = {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  slug: string;
};

// Lista de artículos que se puede consumir en páginas o componentes
export const articles = [
    {
      id: 1,
      title: "Articulo A",
      description: "Descripción del Articulo A.",
      category: "Nutrición",
      image: "/images/product1.avif",
      slug: "nutrientes-esenciales",
    },
    {
      id: 2,
      title: "Articulo B",
      description: "Descripción del Articulo B.",
      category: "Bienestar",
      image: "/images/product2.avif",
      slug: "sistema-inmunologico",
    },
    {
      id: 3,
      title: "Articulo C",
      description: "Descripción del Articulo C.",
      category: "Fitness",
      image: "/images/product3.avif",
      slug: "suplementacion-deportiva",
    },
    {
      id: 4,
      title: "Articulo D",
      description: "Descripción del Articulo D.",
      category: "Salud Mental",
      image: "/images/product4.avif",
      slug: "salud-mental",
    },
  ];
