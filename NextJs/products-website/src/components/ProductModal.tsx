import Image from "next/image";
// Ícono para cerrar el modal
import { X } from "lucide-react";
import { BASE_PATH } from "@/lib/basePath";

// Tipado del producto que se mostrará en el modal
type Product = {
    name: string;
    description: string;
    image: string;
};

// Props que recibe el componente
type Props = {
    product: Product;
    onClose: () => void;
};

// Componente del modal de producto
export default function ProductModal({ product, onClose }: Props) {
    return (
        // Contenedor principal fijo que cubre toda la pantalla
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay oscuro que cierra el modal al hacer clic */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            {/* Contenedor del modal */}
            <div className="relative bg-white rounded-3xl max-w-4xl w-full mx-4 z-10 overflow-hidden">
                {/* Botón para cerrar el modal */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 text-gray-500 hover:text-gray-900"
                >
                    <X size={24} />
                </button>
                {/* Layout en columnas (imagen / contenido) */}
                <div className="grid md:grid-cols-2">
                    {/* Sección de imagen del producto */}
                    <div className="relative h-72 md:h-full bg-gray-50">
                        <Image
                            src={`${BASE_PATH}${product.image}`}
                            alt={product.name}
                            fill
                            className="object-contain p-8"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    </div>
                    {/* Sección de información del producto */}
                    <div className="p-8 flex flex-col">
                        <h3 className="text-2xl text-gray-900 font-bold mb-4">{product.name}</h3>
                        {/* Descripción del producto */}
                        <p className="text-gray-600 mb-6">
                            {`${product.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}
                        </p>
                        {/* Botones de compra */}
                        <div className="mt-auto">
                            <p className="text-gray-900 font-semibold mb-3">Comprar en:</p>
                            <div className="flex gap-4 items-center">
                                {/* Amazon */}
                                <a
                                    href="https://www.amazon.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-40 h-14 rounded-xl bg-[#233448] hover:opacity-90 transition-all"
                                >
                                    <Image
                                        src={`${BASE_PATH}/images/amazonlogo.png`}
                                        alt="Comprar en Amazon"
                                        width={120}
                                        height={40}
                                        className="object-contain max-h-8"
                                    />
                                </a>

                                {/* Mercado Libre */}
                                <a
                                    href="https://www.mercadolibre.com.mx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-40 h-14 rounded-xl bg-[#FFE600] hover:opacity-90 transition-all"
                                >
                                    <Image
                                        src={`${BASE_PATH}/images/mercadolibrelogo.jpg`}
                                        alt="Comprar en Mercado Libre"
                                        width={120}
                                        height={40}
                                        className="object-contain max-h-8"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}