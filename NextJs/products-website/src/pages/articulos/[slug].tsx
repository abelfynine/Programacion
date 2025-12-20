import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
// Lista de artículos
import { articles } from "@/lib/articles";
import { BASE_PATH } from "@/lib/basePath";

// Tipado de los parámetros de la ruta dinámica
type Props = {
  article: any;
};

// Página dinámica del detalle del artículo
export default function ArticuloPage({ article }: Props) {
  if (!article) return null;

  return (
    // Contenedor principal del artículo
    <article className="pt-32 pb-24 bg-white lg:pt-40">
      <div className="max-w-3xl mx-auto px-6">
        {/* Categoría y fecha de publicación */}
        <div className="flex items-center gap-4 mb-4">
          <span className="inline-block px-3 py-1 bg-[#7BA882] text-white text-xs font-semibold uppercase tracking-wider rounded-full">
            {article.category}
          </span>
          <span className="text-sm text-gray-500">
            Publicado el 10 de Enero, 2025
          </span>
        </div>

        {/* Título del artículo */}
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        {/* Descripción del artículo */}
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          {article.description}
        </p>

        {/* Imagen del artículo */}
        <div className="relative w-full h-[380px] rounded-3xl overflow-hidden mb-12 bg-gray-50">
          <Image
            src={`${BASE_PATH}${article.image}`}
            alt={article.title}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Contenido del artículo */}
        <div className="prose prose-lg max-w-none prose-gray text-gray-900">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            vestibulum, tortor nec laoreet placerat, ligula lorem pretium
            tortor, vitae egestas erat eros non dolor.
          </p>
          <p>
            Cras vel sapien at ipsum fermentum tincidunt. Integer non sem
            venenatis, posuere nunc non, faucibus neque. Aliquam erat volutpat.
          </p>
          <h2>Beneficios principales</h2>
          <p>
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus.
          </p>
          <ul>
            <li>Mejora el bienestar general</li>
            <li>Apoya funciones esenciales del cuerpo</li>
            <li>Complementa una dieta balanceada</li>
          </ul>
          <h2>Conclusión</h2>
          <p>
            Donec vitae justo nec velit gravida dictum. Suspendisse potenti.
            Aenean convallis, lorem in dignissim pretium, turpis lorem
            ullamcorper ipsum, nec sagittis purus urna ut libero.
          </p>
        </div>
      </div>
    </article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: articles.map((article) => ({
      params: { slug: article.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const article = articles.find(
    (article) => article.slug === params?.slug
  );

  if (!article) {
    return { notFound: true };
  }

  return {
    props: { article },
  };
};