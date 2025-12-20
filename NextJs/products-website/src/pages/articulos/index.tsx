import Image from "next/image";
import Link from "next/link";
// Lista de artículos
import { articles } from "@/lib/articles";
import { ArrowRight } from "lucide-react";
import { BASE_PATH } from "@/lib/basePath";

// Página que muestra el listado de artículos
export default function ArticulosPage() {
  return (
    // Sección principal de la página
    <section className="py-20 bg-[#F5F9F6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Título de la página */}
        <h1 className="font-serif text-4xl text-gray-900 font-bold mb-12 mt-8">Artículos</h1>
        {/* Artículos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition">
              {/* Imagen del artículo */}
              <div className="relative h-56 bg-gray-50">
                <Image
                  src={`${BASE_PATH}${article.image}`}
                  alt={article.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              {/* Información del Artículo */}
              <div className="p-6">
                {/* Categoria del artículo */}
                <span className="inline-block px-3 py-1 bg-[#7BA882] text-white text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
                  {article.category}
                </span>
                {/* Título del artículo */}
                <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h2>
                {/* Descripción del artículo */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {`${article.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}
                </p>
                {/* Enlace al detalle del artículo */}
                <Link href={`/articulos/${article.slug}`} className="text-[#7BA882] font-semibold text-sm hover:text-[#2D5F3F] transition-colors flex items-center gap-1">
                  Leer más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}