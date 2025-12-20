import Link from "next/link";
import { ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";
import { articles } from "@/lib/articles";
import Image from "next/image";
import { BASE_PATH } from "@/lib/basePath";

// Componente Footer principal
function Footer() {
  // Ícono personalizado de X (Twitter)
  const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <g transform="scale(8.53333)">
        <path d="M26.37,26l-8.795,-12.822l0.015,0.012l7.93,-9.19h-2.65l-6.46,7.48l-5.13,-7.48h-6.95l8.211,11.971l-0.001,-0.001l-8.66,10.03h2.65l7.182,-8.322l5.708,8.322zM10.23,6l12.34,18h-2.1l-12.35,-18z" />
      </g>
    </svg>
  );

  return (
    // Contenedor principal del footer
    <footer className="bg-[#2D5F3F] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        {/* Grid de secciones del footer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Marca y descripción */}
          <div className="flex flex-col items-start">
            {/* Logo */}
            <div className="relative w-[70px] h-[70px]">
              <Image
                src={`${BASE_PATH}/images/empresalogo.avif`}
                alt="Productos Naturales"
                fill
                className="object-contain left-0"
                sizes="70px"
              />
            </div>

            {/* Descripción de la empresa */}
            <p className="text-gray-300 text-sm leading-relaxed mt-6 mb-6">
              Productos naturales de la más alta calidad para mejorar tu salud
              y bienestar integral.
            </p>

            {/* Redes sociales */}
            <div className="flex space-x-4">
              <SocialLink href="https://facebook.com">
                <Facebook size={18} />
              </SocialLink>
              <SocialLink href="https://instagram.com">
                <Instagram size={18} />
              </SocialLink>
              <SocialLink href="https://x.com/">
                <XIcon />
              </SocialLink>
              <SocialLink href="https://linkedin.com">
                <Linkedin size={18} />
              </SocialLink>
            </div>
          </div>

          {/* Links de la empresa */}
          <div>
            <h4 className="text-lg font-bold mb-6">Empresa</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/#quienessomos">Quiénes Somos</FooterLink>
              <FooterLink href="/#servicios">Servicios</FooterLink>
              <FooterLink href="/#productos">Productos</FooterLink>
            </ul>
          </div>

          {/* Articulos */}
          <div>
            <h4 className="text-lg font-bold mb-6">Articulos</h4>
            <ul className="space-y-3 text-sm">
              {articles.slice(0, 4).map((article) => (
                <li key={article.id}>
                  <Link href={`/articulos/${article.slug}`} className="text-gray-300 hover:text-white transition-colors">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boletín */}
          <div>
            <h4 className="text-lg font-bold mb-6">Boletín</h4>
            <p className="text-gray-300 text-sm mb-4">
              Suscríbete para recibir ofertas exclusivas y consejos de salud
            </p>
            <form className="flex">
              {/* Campo de email */}
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-l-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7BA882] text-sm"
              />
              {/* Botón de envío */}
              <button
                type="submit"
                aria-label="Suscribirse"
                className="px-6 py-3 bg-[#7BA882] rounded-r-xl hover:bg-[#7BA882]/90 transition"
              >
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Sección inferior del footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center text-sm">
            <p className="text-gray-400 text-center">
              © 2025 Productos Naturales. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===== Componentes auxiliares ===== */
// Link de red social con estilos y hover
function SocialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center border-2 border-white/30 rounded-full hover:bg-white hover:text-[#2D5F3F] transition"
    >
      {children}
    </a>
  );
}

// Link reutilizable del footer
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-300 hover:text-white transition"
      >
        {children}
      </Link>
    </li>
  );
}

export default Footer;
