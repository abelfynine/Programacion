import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowDown, Truck, HeartPulse, Eye, Star, Stethoscope, HeartPlus, FlaskConical, Zap, ShieldPlus, BicepsFlexed, Plus, ArrowRight, Mail, Phone, MapPin } from "lucide-react";
// Lista de artículos
import { articles } from "@/lib/articles";
// Modal de productos
import ProductModal from "@/components/ProductModal";
import { useState } from "react";
import { BASE_PATH } from "@/lib/basePath";

/* === HERO === */
// Sección principal con imagen de fondo y CTAs
function Hero() {
  const [loaded, setLoaded] = useState(false);
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#C8C9CA]">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src={`${BASE_PATH}/images/hero.avif`}
          alt="Health and Wellness"
          fill
          priority
          onLoadingComplete={() => setLoaded(true)}
          className={`object-cover object-top transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-sm mb-6">
            <ShieldCheck className="text-white mr-2 text-sm" />
            <span className="text-white text-xs font-semibold uppercase tracking-wider">
              Certificado por FDA
            </span>
          </div>

          {/* Título */}
          <h1 className="font-serif text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
            Tu{" "}
            <span className="text-[#96e7a2] font-bold">Salud</span> y{" "}
            <span className="text-[#96e7a2] font-bold">Bienestar</span> Son Nuestra
            Prioridad
          </h1>

          {/* Descripción */}
          <p className="text-lg lg:text-xl text-white/90 leading-relaxed mb-10 max-w-xl">
            Productos naturales de la más alta calidad, respaldados por la
            ciencia y diseñados para mejorar tu vida diaria con ingredientes
            puros y efectivos.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="#productos"
              className="px-10 py-4 bg-[#7BA882] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Comprar Ahora
            </Link>

            <Link
              href="#articulos"
              className="px-10 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#7BA882] transition-all duration-300 whitespace-nowrap"
            >
              Ver Artículos
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <Link
          href="#quienessomos"
          className="w-10 h-10 flex items-center justify-center animate-bounce"
        >
          <ArrowDown className="w-7 h-7" strokeWidth={3} />
        </Link>
      </div>
    </section>
  );
}

/* === QUIENES SOMOS === */
// Sección informativa de la empresa
function About() {
  return (
    <section id="quienessomos" className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#7BA882] mb-6">
            <span className="text-[#7BA882] text-xs font-semibold uppercase tracking-wider">
              Nuestra Historia
            </span>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-gray-900">
            Quiénes Somos
          </h2>
        </div>
        {/* Texto descriptivo + Misión, Visión y Valores */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Texto descriptivo */}
          <div>
            <p className="text-base lg:text-lg text-gray-700 leading-relaxed mb-6">
              Somos una empresa dedicada a transformar vidas a través de
              productos naturales de la más alta calidad. Con más de 15 años
              de experiencia en el sector de la salud y el bienestar, nos hemos
              consolidado como líderes en la industria.
            </p>
            <p className="text-base lg:text-lg text-gray-700 leading-relaxed mb-6">
              Cada uno de nuestros productos está formulado con ingredientes
              cuidadosamente seleccionados, respaldados por estudios científicos
              rigurosos y fabricados bajo los más estrictos estándares de calidad
              internacional.
            </p>
            <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
              Creemos que la salud es el activo más valioso, y por eso trabajamos
              incansablemente para ofrecer soluciones naturales que potencien tu
              energía, fortalezcan tu sistema inmunológico y mejoren tu calidad
              de vida.
            </p>
          </div>

          {/* Misión, Visión y Valores */}
          <div className="space-y-6">
            {/* Misión */}
            <div className="bg-[#F5F9F6] rounded-2xl p-8 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <HeartPulse size={88} className="text-[#2D5F3F]"/>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Misión
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Proporcionar productos de salud de la más alta calidad que
                    mejoren el bienestar integral de nuestros clientes,
                    respaldados por investigación científica y formulaciones
                    naturales.
                  </p>
                </div>
              </div>
            </div>

            {/* Visión */}
            <div className="bg-[#F5F9F6] rounded-2xl p-8 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <Eye size={80} className="text-[#2D5F3F]"/>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Visión
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Ser la marca líder en productos naturales, reconocida por
                    nuestra innovación, transparencia y compromiso
                    inquebrantable con la salud de las personas.
                  </p>
                </div>
              </div>
            </div>

            {/* Valores */}
            <div className="bg-[#F5F9F6] rounded-2xl p-8 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <Star size={64} className="text-[#2D5F3F]"/>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Valores
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Calidad excepcional, transparencia total, respaldo
                    científico, sostenibilidad ambiental y un compromiso genuino
                    con el bienestar de cada cliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* === SERVICIOS === */
// Lista de servicios ofrecidos
function Services() {
  const services = [
    {
      title: "Consultoría Personalizada",
      description: "Nuestros expertos en nutrición te brindan asesoramiento personalizado para identificar los productos ideales según tus necesidades específicas de salud y estilo de vida.",
      icon: Stethoscope,
      delay: "0ms",
    },
    {
      title: "Productos Personalizados",
      description: "Creamos fórmulas únicas adaptadas a tus objetivos de salud, combinando ingredientes naturales de la más alta calidad con dosificaciones precisas y efectivas.",
      icon: FlaskConical,
      delay: "100ms",
    },
    {
      title: "Entrega a Domicilio",
      description: "Recibe tus productos directamente en tu hogar con envíos rápidos y seguros. Ofrecemos suscripciones mensuales para que nunca te quedes sin tus productos favoritos.",
      icon: Truck,
      delay: "200ms",
    },
  ];

  return (
    <section id="servicios" className="py-20 lg:py-28 bg-[#E8F3EA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ofrecemos soluciones integrales para tu bienestar
          </p>
        </div>

        {/* Servicios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-white rounded-3xl p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: service.delay }}
              >
                {/* Icono del servicio */}
                <div className="w-16 h-16 flex items-center justify-center mb-6">
                  <Icon className="w-14 h-14 text-[#7BA882]" />
                </div>
                {/* Título del servicio*/}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                {/* Descripción del servicio */}
                <p className="text-base text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* === BENEFICIOS === */
// Beneficios principales de los productos
function Benefits() {
  const benefits = [
    {
      number: "01",
      title: "Energía Sostenida",
      description: "Aumenta tu vitalidad y rendimiento diario con nutrientes esenciales que combaten la fatiga y potencian tu energía natural sin estimulantes artificiales.",
      icon: Zap,
      delay: "0ms",
    },
    {
      number: "02",
      title: "Sistema Inmune Fuerte",
      description: "Fortalece tus defensas naturales con vitaminas, minerales y antioxidantes que protegen tu organismo contra enfermedades.",
      icon: ShieldPlus,
      delay: "100ms",
    },
    {
      number: "03",
      title: "Digestión Saludable",
      description: "Mejora tu salud intestinal con probióticos y enzimas digestivas que optimizan la absorción de nutrientes y el bienestar digestivo.",
      icon: HeartPlus,
      delay: "200ms",
    },
    {
      number: "04",
      title: "Rendimiento Físico",
      description: "Optimiza tu desempeño deportivo y recuperación muscular con aminoácidos, proteínas y nutrientes especializados para atletas.",
      icon: BicepsFlexed,
      delay: "300ms",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
            Beneficios de los productos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre cómo nuestros productos pueden transformar tu salud
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="relative bg-gradient-to-br from-white to-[#F5F9F6] border border-[#E8F3EA] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: benefit.delay }}
              >
                {/* Numero */}
                <div className="absolute top-6 right-6 text-7xl font-bold text-[#7BA882] opacity-5">
                  {benefit.number}
                </div>
                <div className="relative z-10">
                  {/* Icono del servicio */}
                  <div className="w-14 h-14 flex items-center justify-center mb-6">
                    <Icon className="w-12 h-12 text-[#7BA882]" />
                  </div>
                  {/* Título del servicio */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  {/* Descripción del servicio */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* === PRODUCTOS === */
// Catálogo de productos con modal
function Products() {
  // Producto seleccionado para el modal
  const [selectedProduct, setSelectedProduct] = useState<null | {
    name: string;
    description: string;
    image: string;
  }>(null);

  const products = [
    {
      name: "Producto A",
      description: "Descripción del Producto A.",
      image: "/images/product1.avif",
      delay: "0ms",
    },
    {
      name: "Producto B",
      description: "Descripción del Producto B.",
      image: "/images/product2.avif",
      delay: "100ms",
    },
    {
      name: "Producto C",
      description: "Descripción del Producto C.",
      image: "/images/product3.avif",
      delay: "200ms",
    },
    {
      name: "Producto D",
      description: "Descripción del Producto D.",
      image: "/images/product4.avif",
      delay: "300ms",
    },
    {
      name: "Producto E",
      description: "Descripción del Producto E.",
      image: "/images/product5.avif",
      delay: "400ms",
    },
    {
      name: "Producto F",
      description: "Descripción del Producto F.",
      image: "/images/product6.avif",
      delay: "500ms",
    },
  ];

  return (
    <section
      id="productos"
      className="py-20 lg:py-28 bg-[#F5F9F6]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
            Productos Destacados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nuestra selección de productos más populares y efectivos
          </p>
        </div>

        {/* Productos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-3xl overflow-hidden flex flex-col h-full
             hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Imagen del producto */}
              <div className="relative w-full h-64 bg-gray-50 flex items-center justify-center">
                <Image
                  src={`${BASE_PATH}${product.image}`}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              {/* Información del producto */}
              <div className="p-7 flex flex-col flex-1">
                {/* Nombre del producto */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                {/* Descripción del producto */}
                <p className="text-sm text-gray-600 mb-6 line-clamp-3 min-h-[60px]">
                  {`${product.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}
                </p>
                {/* Ver mas detalle del producto */}
                <button onClick={() => setSelectedProduct(product)} className="mt-auto w-full py-3 border-2 border-[#7BA882] 
                       text-[#7BA882] font-semibold rounded-xl
                       hover:bg-[#7BA882] hover:text-white 
                       transition-all duration-300">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Al hacer clic se abre el modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}

/* === FAQS === */
// Preguntas frecuentes con Acordeón
function FAQ() {
  const faqs = [
    {
      question: "¿Son seguros sus productos?",
      answer: "Absolutamente. Todos nuestros productos están fabricados en instalaciones certificadas por la FDA y cumplen con los más altos estándares de calidad. Cada lote es sometido a rigurosas pruebas de pureza y potencia por laboratorios independientes.",
    },
    {
      question: "¿Cómo sé qué productos necesito?",
      answer: "Ofrecemos consultas gratuitas con nuestros expertos en nutrición que evaluarán tus necesidades específicas, estilo de vida y objetivos de salud. También puedes completar nuestro cuestionario en línea para recibir recomendaciones personalizadas.",
    },
    {
      question: "¿Cuál es la dosis recomendada?",
      answer: "Cada producto incluye instrucciones detalladas de dosificación en la etiqueta. Las dosis varían según el producto y tus necesidades individuales. Siempre recomendamos consultar con un profesional de la salud antes de comenzar cualquier régimen de suplementación.",
    },
    {
      question: "¿Tienen certificaciones de calidad?",
      answer: "Sí, contamos con certificaciones GMP (Buenas Prácticas de Manufactura), certificación orgánica USDA para productos aplicables y realizamos pruebas de terceros para garantizar la pureza.",
    },
    {
      question: "¿Cuánto tiempo tarda el envío?",
      answer: "Los pedidos se procesan en 24-48 horas. El envío estándar toma de 3-5 días hábiles y el envío express llega en 1-2 días hábiles. Ofrecemos envío gratuito en pedidos superiores a $50.",
    },
    {
      question: "¿Puedo devolver un producto si no estoy satisfecho?",
      answer: "Ofrecemos una garantía de satisfacción de 60 días. Si no estás completamente satisfecho con tu compra, puedes devolverla para obtener un reembolso completo, incluso si el producto está abierto.",
    },
  ];

  // Estado que guarda el índice del elemento actualmente abierto
  // null significa que ninguno está abierto
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Función para abrir o cerrar un elemento
  const toggle = (index: number) => {
    // Si el elemento ya está abierto, lo cierra (null)
    // Si no está abierto, lo abre guardando su índice
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-gray-600">
            Respuestas a las dudas más comunes sobre nuestros productos
          </p>
        </div>
        {/* Acordeón */}
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  onClick={() => toggle(index)}
                  className="w-full py-6 px-6 md:px-8 flex items-center justify-between text-left hover:bg-[#F5F9F6] transition-colors duration-300"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-bold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <Plus className={`w-6 h-6 text-[#7BA882] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}/>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-6 md:px-8 pb-6">
                    <p className="text-base text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA que lleva a la sección de contacto */}
        <div className="text-center mt-12">
          <p className="text-base text-gray-600 mb-4">
            ¿Más preguntas?
          </p>
          <Link href="#contacto" className="text-[#7BA882] font-semibold hover:text-[#2D5F3F] transition-colors">
            Contáctanos →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* === ARTÍCULOS === */
// Artículos con informacion
function Articles() {
  return (
    <section id="articulos" className="py-20 lg:py-28 bg-[#E8F3EA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Título */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-gray-900 mb-2">
              Artículos y Consejos
            </h2>
            <p className="text-lg text-gray-600">
              Información valiosa para tu salud y bienestar
            </p>
          </div>
          <Link
            href="/articulos"
            className="hidden lg:inline-flex px-6 py-3 border-2 border-[#7BA882] text-[#7BA882] font-semibold rounded-xl hover:bg-[#7BA882] hover:text-white transition-all"
          >
            Ver Todos
          </Link>
        </div>

        {/* Artículos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Imagen del artículo */}
              <div className="relative w-full aspect-[16/9] bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src={`${BASE_PATH}${article.image}`}
                  alt={article.title}
                  fill
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
              {/* Información del artículo */}
              <div className="p-6">
                {/* Categoria del artículo */}
                <span className="inline-block px-3 py-1 bg-[#7BA882] text-white text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
                  {article.category}
                </span>
                {/* Título del artículo */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                {/* Descripción del artículo */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {`${article.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}
                </p>
                <Link
                  href={`/articulos/${article.slug}`}
                  className="text-[#7BA882] font-semibold text-sm hover:text-[#2D5F3F] transition-colors flex items-center gap-1"
                >
                  Leer más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {/* Mobile CTA */}
        <div className="text-center mt-8 lg:hidden">
          <Link
            href="/articulos"
            className="inline-flex px-6 py-3 border-2 border-[#7BA882] text-[#7BA882] font-semibold rounded-xl hover:bg-[#7BA882] hover:text-white transition-all"
          >
            Ver Todos
          </Link>
        </div>
      </div>
    </section>
  );
}

/* === CONTACTO === */
// Información de contacto + formulario
function Contact() {
  const [mensaje, setMensaje] = useState("");
  const WhatsAppIcon = ({ className = "w-6 h-6", }: { className?: string; }) => (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Burbuja (solo contorno) */}
      <path
        d="M16 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.467.64 4.853 1.853 6.96L2.667 29.333l6.533-1.72A13.23 13.23 0 0 0 16 29.333c7.36 0 13.333-5.973 13.333-13.333C29.333 8.64 23.36 2.667 16 2.667z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Teléfono (relleno) */}
      <path
        d="M22.838 18.977c-.371-.186-2.197-1.083-2.537-1.208-.341-.124-.589-.185-.837.187-.246.371-.958 1.207-1.175 1.455-.216.249-.434.279-.805.094-1.15-.466-2.138-1.087-2.997-1.852-.799-.74-1.484-1.587-2.037-2.521-.216-.371-.023-.572.162-.757.167-.166.372-.434.557-.65.146-.179.271-.384.366-.604.043-.087.068-.188.068-.296 0-.131-.037-.253-.101-.357-.094-.186-.836-2.014-1.145-2.758-.302-.724-.609-.625-.836-.637-.216-.01-.464-.012-.712-.012-.395.01-.746.188-.988.463-.802.761-1.3 1.834-1.3 3.023.131 1.467.681 2.784 1.527 3.857 1.604 2.379 3.742 4.282 6.251 5.564.548.248 1.25.513 1.968.74.442.14.951.221 1.479.221.303 0 .601-.027.889-.078 1.069-.223 1.956-.868 2.497-1.749.165-.366.261-.793.261-1.242 0-.185-.016-.366-.047-.542-.092-.155-.34-.247-.712-.434z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <section id="contacto" className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Título */}
          <div>
            <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-gray-900 mb-6">
              Contáctanos
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              ¿Tienes preguntas sobre nuestros productos o necesitas
              asesoramiento personalizado? Estamos aquí para ayudarte.
            </p>
            {/* Datos de contacto */}
            <div className="space-y-6 mb-10">
              <div className="flex items-start">
                <div className="w-12 h-12 flex items-center justify-center mr-4">
                  <Mail className="w-7 h-7 text-[#7BA882]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">info@productos.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 flex items-center justify-center mr-4">
                  <Phone className="w-7 h-7 text-[#7BA882]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Teléfono</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 flex items-center justify-center mr-4">
                  <MapPin className="w-7 h-7 text-[#7BA882]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Dirección
                  </h4>
                  <p className="text-gray-600">
                    123 Calle Producto, Ciudad, País
                  </p>
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/15551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-8 py-4 bg-[#25D366] text-white font-semibold rounded-2xl hover:bg-[#20BA5A] transition-all shadow-lg hover:shadow-xl"
            >
              <WhatsAppIcon className="w-6 h-6 mr-3" />
              Chatea con Nosotros en WhatsApp
            </a>
          </div>

          {/* Formulario */}
          <div>
            <form className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-bold text-gray-900 mb-2">
                  Nombre Completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  className="w-full h-14 px-4 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 placeholder:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#7BA882] transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  className="w-full h-14 px-4 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 placeholder:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#7BA882] transition-all"
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block text-sm font-bold text-gray-900 mb-2">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full h-14 px-4 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 placeholder:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#7BA882] transition-all"
                />
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-sm font-bold text-gray-900 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  maxLength={500}
                  required
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 placeholder:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#7BA882] resize-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {mensaje.length}/500 caracteres
                </p>
              </div>
              <button type="submit" className="w-full h-14 bg-[#7BA882] text-white font-semibold rounded-xl hover:bg-[#2D5F3F] transition-all shadow-lg hover:shadow-xl">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* === PAGE === */
// Página principal que renderiza todas las secciones
export default function Page() {
  return (
    <main className="font-sans">
      <Hero />
      <About />
      <Services />
      <Benefits />
      <Products />
      <FAQ />
      <Articles />
      <Contact />
    </main>
  );
}
