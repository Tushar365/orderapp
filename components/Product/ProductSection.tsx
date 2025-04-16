import Link from "next/link";
import ProductCard from "@/components/Product/ProductCard";

interface ProductSectionProps {
  title: string;
  products: Array<{
    id: number;
    name: string;
    price: number;
    originalPrice: number | null;
    image: string;
    sale: boolean;
    rating: number;
  }>;
  showSeeAll?: boolean;
  seeAllLink?: string;
  children?: React.ReactNode;
}

export default function ProductSection({
  title,
  products,
  showSeeAll = false,
  seeAllLink = "/products",
  children,
}: ProductSectionProps) {
  return (
    <section className="py-10 px-2 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">{title}</h2>
          <div className="flex items-center space-x-2">
            {children}
            {showSeeAll && (
              <Link 
                href={seeAllLink}
                className="border border-blue-100 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-md text-sm font-medium transition-all"
              >
                See All Products
              </Link>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}