"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, AlertCircle } from "lucide-react";

interface ResultModalProps {
  success: boolean;
  orderId: string | null;
  onCloseAction: () => void;
}

export default function ResultModal({ success,  onCloseAction }: ResultModalProps) {
  // Removed: const [copied, setCopied] = useState(false);
  // Removed: copyToClipboard function

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        {success ? (
          <>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Order Placed Successfully!</h2>
              <p className="text-gray-600 mt-2">
                Your order has been received and will be processed shortly.
              </p>
              {/* Order ID display and copy removed */}
            </div>
            
            <div className="mt-6">
              <p className="text-gray-600 text-sm mb-4">
                You will receive a confirmation email with your order details shortly.
              </p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={onCloseAction}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Order Processing Failed</h2>
              <p className="text-gray-600 mt-2">
                We encountered an issue while processing your order. Please try again later.
              </p>
            </div>
            
            <div className="mt-6">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={onCloseAction}
              >
                Try Again
              </Button>
            </div>
          </>
        )}
        
        <button 
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
          onClick={onCloseAction}
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}