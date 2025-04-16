import Image from "next/image";

export default function ProductCard({ product }: { product: { 
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  sale: boolean;
  rating: number;
} }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md">
      <div className="relative mb-3 bg-gray-50 rounded-lg p-4 flex justify-center">
        {product.sale && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            SALE
          </span>
        )}
        <Image 
          src={product.image} 
          alt={product.name} 
          width={120} 
          height={120} 
          className="object-contain h-32" 
        />
      </div>
      <h3 className="font-medium text-sm text-gray-800 line-clamp-2 h-10">{product.name}</h3>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="text-blue-700 font-semibold">₹{product.price.toFixed(2)}</p>
          {product.originalPrice && (
            <p className="text-gray-400 text-xs line-through">₹{product.originalPrice.toFixed(2)}</p>
          )}
        </div>
        {product.rating && (
          <div className="flex items-center text-xs text-gray-500">
            <span className="text-yellow-400 mr-1">★</span>
            {product.rating}
          </div>
        )}
      </div>
    </div>
  );
}