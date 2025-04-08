// File: app/orders/components/ConfirmationModal.tsx
"use client";

import { OrderFormData } from "../page";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  formData: OrderFormData;
  prescriptionFile: File | null;
  onCancelAction: () => void;
  onConfirmAction: () => void;
  isSubmitting: boolean;
}

export default function ConfirmationModal({
  formData,
  prescriptionFile,
  onCancelAction,
  onConfirmAction,
  isSubmitting,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-xl my-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Your Order</h2>
        
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <h3 className="font-medium mb-2 text-gray-800">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-900">
            <p><span className="font-medium">Name:</span> {formData.name}</p>
            <p><span className="font-medium">Contact:</span> {formData.contact}</p>
            <p className="md:col-span-2"><span className="font-medium">Address:</span> {formData.address}</p>
            <p><span className="font-medium">Pincode:</span> {formData.pincode}</p>
            <p className="md:col-span-2">
              <span className="font-medium">Prescription:</span> {prescriptionFile?.name || 'Not uploaded'}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <h3 className="font-medium mb-2 text-gray-800">Medicines</h3>
          {formData.medicines.length === 0 ? (
            <p className="text-gray-900 italic">No medicines added</p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-gray-900">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Medicine Name</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.medicines.map((medicine, index) => (
                    <tr key={index} className="border-b border-blue-100">
                      <td className="px-4 py-2">{medicine.name}</td>
                      <td className="px-4 py-2">{medicine.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancelAction}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirmAction}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              'Confirm Order'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}