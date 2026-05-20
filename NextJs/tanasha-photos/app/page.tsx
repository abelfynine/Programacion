"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { BASE_PATH } from "@/lib/basePath";

export default function Home() {

  const images = [
    `${BASE_PATH}/images/portfolio/photo1.avif`,
    `${BASE_PATH}/images/portfolio/photo2.avif`,
    `${BASE_PATH}/images/portfolio/photo3.avif`,
    `${BASE_PATH}/images/portfolio/photo4.avif`,
    `${BASE_PATH}/images/portfolio/photo5.avif`,
    `${BASE_PATH}/images/portfolio/photo6.avif`,
    `${BASE_PATH}/images/portfolio/photo7.avif`,
    `${BASE_PATH}/images/portfolio/photo8.avif`,
    `${BASE_PATH}/images/portfolio/photo9.avif`,
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // SWIPE refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [flowers, setFlowers] = useState<{ id: number; x: number; y: number }[]>([]);

  const createFlower = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Evita clicks en botones, imágenes, links, etc.
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("img")
    ) {
      return;
    }

    const newFlower = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };

    setFlowers((prev) => [...prev, newFlower]);

    setTimeout(() => {
      setFlowers((prev) =>
        prev.filter((flower) => flower.id !== newFlower.id)
      );
    }, 1200);
  };

  // BLOQUEAR SCROLL
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "auto";
  }, [activeIndex]);

  // SCROLL FIX
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const navHeight = document.querySelector("nav")?.clientHeight || 80;
    const y = el.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: y, behavior: "smooth" });
    setMenuOpen(false);
  };

  // ANIMACIONES
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  // CONTROLES
  const nextImage = () => {
    if (activeIndex !== null && activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const prevImage = () => {
    if (activeIndex !== null && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  // SWIPE LOGIC
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) {
      // swipe izquierda → siguiente
      nextImage();
    }

    if (distance < -50) {
      // swipe derecha → anterior
      prevImage();
    }
  };

  // TECLADO
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;

      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  return (
    <main className="bg-white text-gray-900 pt-16 overflow-hidden" onClick={createFlower}>

      {/* NAV */}
      <nav className="fixed top-0 w-full bg-white border-b z-50 h-16 flex items-center">
        <div className="max-w-6xl mx-auto flex justify-between items-center w-full px-4">

          <h1 className="text-sm md:text-lg font-semibold tracking-widest uppercase">
            TanashaPhotos
          </h1>

          <div className="hidden md:flex space-x-8 text-sm tracking-wide font-medium">
            <button className="cursor-pointer hover:text-gray-500" onClick={() => scrollToSection("inicio")}>Inicio</button>
            <button className="cursor-pointer hover:text-gray-500" onClick={() => scrollToSection("portafolio")}>Portafolio</button>
            <button className="cursor-pointer hover:text-gray-500" onClick={() => scrollToSection("about")}>Acerca de mí</button>
            <button className="cursor-pointer hover:text-gray-500" onClick={() => scrollToSection("contacto")}>Contacto</button>
          </div>

          <button
            className="md:hidden text-2xl cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-b flex flex-col items-center gap-6 py-6 md:hidden">
            <button className="cursor-pointer" onClick={() => scrollToSection("inicio")}>Inicio</button>
            <button className="cursor-pointer" onClick={() => scrollToSection("portafolio")}>Portafolio</button>
            <button className="cursor-pointer" onClick={() => scrollToSection("about")}>Acerca de mí</button>
            <button className="cursor-pointer" onClick={() => scrollToSection("contacto")}>Contacto</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="inicio" className="h-screen relative flex items-center justify-center text-center px-4">
        <Image src={`${BASE_PATH}/images/hero.avif`} alt="hero" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-white fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-light mb-4 md:mb-6">
            TANASHAPHOTOS
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 md:mb-8">
            Cada fotografía cuenta una historia.
          </p>

          <button
            onClick={() => scrollToSection("portafolio")}
            className="cursor-pointer border px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-white hover:text-black transition"
          >
            Ver Portafolio
          </button>
        </div>
      </section>

      {/* PORTAFOLIO */}
      <section id="portafolio" className="py-20 md:py-28 px-4 md:px-6 max-w-6xl mx-auto">
        <h3 className="text-2xl md:text-4xl font-light text-center mb-10 md:mb-16 fade-in">
          Portafolio
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {images.map((src, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className="cursor-pointer group overflow-hidden rounded-2xl fade-in"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={src}
                  alt="foto"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-28 px-4 md:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-4xl font-light text-center mb-10 md:mb-16 fade-in">
            Acerca de mí
          </h3>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="flex justify-center fade-in">
              <div className="relative w-52 h-52 md:w-72 md:h-72 rounded-full p-[2px] shadow-[0_0_25px_rgba(62,86,65,0.16)] hover:shadow-[0_0_90px_rgba(62,86,65,0.45)] transition-all duration-500 hover:scale-[1.04]">
                <Image
                  src={`${BASE_PATH}/images/about.avif`}
                  alt="Tania"
                  fill
                  priority
                  sizes="(max-width: 768px) 208px, 288px"
                  className="object-cover rounded-full shadow-xl"
                />
              </div>
            </div>

            <div className="fade-in text-base md:text-lg text-gray-600 text-center md:text-left">
              Soy Tania Espino, fotógrafa apasionada por capturar emociones reales.
              Mi enfoque combina creatividad, luz natural y detalles para contar historias.
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 md:py-28 px-4 md:px-6 text-center">
        <h3 className="text-2xl md:text-4xl font-light mb-4 md:mb-6 fade-in">Contacto</h3>

        <p className="text-gray-500 mb-6 md:mb-10 fade-in text-sm md:text-lg">
          Sígueme en mis redes sociales
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 fade-in">

          <Link
            href="https://www.facebook.com/tanashaphotos"
            target="_blank"
            className="group flex items-center justify-center gap-3 px-7 py-3 rounded-full bg-white/70 backdrop-blur-md border border-gray-200 shadow-[0_0_25px_rgba(0,0,0,0.05)] hover:shadow-[0_0_35px_rgba(24,119,242,0.25)] hover:-translate-y-1 transition-all duration-300">
            <Image
              src={`${BASE_PATH}/images/facebook.png`}
              alt="Facebook"
              width={22}
              height={22}
              className="transition duration-300 group-hover:scale-110"
            />

            <span className="text-sm md:text-base text-gray-700 group-hover:text-black">
              Facebook
            </span>
          </Link>

          <Link
            href="https://www.instagram.com/un.intento.de.fotografa"
            target="_blank"
            className="group flex items-center justify-center gap-3 px-7 py-3 rounded-full bg-white/70 backdrop-blur-md border border-gray-200 shadow-[0_0_25px_rgba(0,0,0,0.05)] hover:shadow-[0_0_35px_rgba(255,80,120,0.25)] hover:-translate-y-1 transition-all duration-300">
            <Image
              src={`${BASE_PATH}/images/instagram.png`}
              alt="Instagram"
              width={22}
              height={22}
              className="transition duration-300 group-hover:scale-110"
            />

            <span className="text-sm md:text-base text-gray-700 group-hover:text-black">
              Instagram
            </span>
          </Link>

          <Link
            href="https://wa.me/5218146950392"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 px-7 py-3 rounded-full bg-white/70 backdrop-blur-md border border-gray-200 shadow-[0_0_25px_rgba(0,0,0,0.05)] hover:shadow-[0_0_35px_rgba(37,211,102,0.30)] hover:-translate-y-1 transition-all duration-300"
          >
            <Image
              src={`${BASE_PATH}/images/whatsapp.png`}
              alt="WhatsApp"
              width={22}
              height={22}
              className="transition duration-300 group-hover:scale-110"
            />
          
            <span className="text-sm md:text-base text-gray-700 group-hover:text-black">
              WhatsApp
            </span>
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-gray-50 py-10 px-4 text-center text-xs md:text-sm text-gray-400">
        © {new Date().getFullYear()} TANASHAPHOTOS. Todos los derechos reservados.
      </footer>

      {/* LIGHTBOX CON SWIPE */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center"
          onClick={() => setActiveIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button onClick={() => setActiveIndex(null)} className="absolute top-6 right-6 text-white text-3xl cursor-pointer">✕</button>

          {activeIndex > 0 && (
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-6 text-white text-5xl cursor-pointer">‹</button>
          )}

          {activeIndex < images.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-6 text-white text-5xl cursor-pointer">›</button>
          )}

          <div className="relative w-[90%] max-w-5xl h-[80%]" onClick={(e) => e.stopPropagation()}>
            <Image src={images[activeIndex]} alt="preview" fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}

      {/* ANIMACIONES */}
      <style jsx global>{`
        .fade-in {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fade-in.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* FLOWERS */}
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="flower-effect"
          style={{
            left: flower.x,
            top: flower.y,
          }}
        >
          🌸
        </div>
      ))}

    </main>
  );
}
