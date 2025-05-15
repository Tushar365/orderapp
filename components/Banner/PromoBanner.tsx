import Image from "next/image";
import Link from "next/link";

interface PromoBannerProps {
  title: string;
  description: string;
  link: string;
  linkLabel: string;
  image: string;
  // bgColor removed
}

/**
 * Renders a promotional banner with a title, description, link, and image.
 *
 * Displays the provided title and description, a styled link with a label and arrow icon, and an image positioned at the bottom right of the banner.
 *
 * @param title - The heading text for the banner.
 * @param description - The descriptive text displayed below the title.
 * @param link - The URL to navigate to when the link is clicked.
 * @param linkLabel - The text label for the link.
 * @param image - The source URL of the image displayed in the banner.
 *
 * @returns A styled JSX element representing the promotional banner.
 */
export default function PromoBanner({
  title,
  description,
  link,
  linkLabel,
  image,
  // bgColor removed
}: PromoBannerProps) {
  return (
    <div className="rounded-xl p-6 relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-violet-50">
      <div className="relative z-10">
        <h3 className="font-semibold text-xl text-blue-900 mb-2">{title}</h3>
        <p className="text-blue-700 mb-4 text-sm">{description}</p>
        <Link href={link} className="text-sm font-semibold flex items-center text-blue-700 hover:text-violet-600 transition-colors">
          {linkLabel}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
      <Image 
        src={image} 
        alt={title} 
        width={120} 
        height={120} 
        className="absolute bottom-0 right-4 h-24 object-contain" 
      />
    </div>
  );
}