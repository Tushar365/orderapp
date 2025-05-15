import Image from "next/image";
import Link from "next/link";

/**
 * Renders a styled card displaying a category's image, name, and a link to its detail page.
 *
 * @param category - The category object containing id, name, slug, and image URL.
 * @returns A React element representing the category card.
 */
export default function CategoryCard({ category }: { category: { 
  id: number;
  name: string;
  slug: string;
  image: string;
} }) {
  return (
    <div className="relative group overflow-hidden rounded-xl shadow-sm bg-blue-50">
      <Image 
        src={category.image} 
        alt={category.name} 
        width={300} 
        height={200} 
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-200/70 via-white/30 to-transparent flex flex-col justify-end p-4">
        <h3 className="text-blue-900 font-semibold text-lg">{category.name}</h3>
        <Link 
          href={`/categories/${category.slug}`} 
          className="text-blue-700 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 underline"
        >
          View All
        </Link>
      </div>
    </div>
  );
}