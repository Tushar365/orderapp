import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold text-white mb-2">MedGhor</h3>
            <p className="text-sm">Your trusted healthcare partner</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h4 className="text-white font-medium mb-2">Quick Links</h4>
              <ul className="space-y-1">
                <li><Link href="/" className="text-sm hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/orders" className="text-sm hover:text-white transition-colors">Order Medicines</Link></li>
                <li><Link href="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Contact</h4>
              <ul className="space-y-1">
                <li className="text-sm">Email: contact@medghor.com</li>
                <li className="text-sm">Phone: +91 1234567890</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {currentYear} MedGhor. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link href="/privacy" className="text-xs hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}