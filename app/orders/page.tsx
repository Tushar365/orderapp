// File: app/orders/page.tsx
"use client";

import { useState, useRef } from "react";

type Medicine = {
  sl_no: number;
  name: string;
  quantity: number;
};

type OrderFormData = {
  name: string;
  contact: string;
  address: string;
  pincode: string;
  prescription_file_url?: string;
  medicines: Medicine[];
};

const pincodes = ["732123/Chanchal", "700001/Kolkata", "732101/Malda", "700234/Any"];
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrderPage() {
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    contact: "",
    address: "",
    pincode: "",
    prescription_file_url: "",
    medicines: [],
  });
  
  const [medicineName, setMedicineName] = useState("");
  const [medicineQuantity, setMedicineQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPrescriptionFile(e.target.files[0]);
    }
  };
  
  const addMedicine = () => {
    if (!medicineName) return;
    
    const newMedicine: Medicine = {
      sl_no: formData.medicines.length + 1,
      name: medicineName,
      quantity: Math.min(Math.max(1, medicineQuantity), 50), // Ensure between 1 and 50
    };
    
    setFormData({
      ...formData,
      medicines: [...formData.medicines, newMedicine],
    });
    
    // Reset inputs
    setMedicineName("");
    setMedicineQuantity(1);
  };
  
  const removeMedicine = (index: number) => {
    const updatedMedicines = [...formData.medicines];
    updatedMedicines.splice(index, 1);
    
    // Renumber the sl_no for each medicine
    const renumberedMedicines = updatedMedicines.map((med, idx) => ({
      ...med,
      sl_no: idx + 1,
    }));
    
    setFormData({
      ...formData,
      medicines: renumberedMedicines,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true); // Show confirmation modal instead of submitting directly
  };
  
  const closeResultModal = () => {
    setShowResultModal(false);
  };
  
  const confirmOrder = async () => {
    try {
      setIsSubmitting(true);
      
      // Generate an order ID
      const timestamp = new Date().getTime();
      const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const generatedOrderId = `ORD-${timestamp}-${randomId}`;
      
      // Handle file upload if a prescription file is selected
      let prescriptionFileUrl = "";
      
      if (prescriptionFile) {
        // Create a FormData object to upload the file
        const fileFormData = new FormData();
        fileFormData.append('file', prescriptionFile);
        fileFormData.append('orderId', generatedOrderId);
        
        try {
          const uploadResponse = await fetch('/api/upload-prescription', {
            method: 'POST',
            body: fileFormData,
          });
          
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            prescriptionFileUrl = uploadResult.fileUrl;
          }
        } catch (error) {
          console.error("Error uploading prescription:", error);
        }
      }
      
      // Submit the order
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          orderId: generatedOrderId,
          prescription_file_url: prescriptionFileUrl,
        }),
      });
      
      if (response.ok) {
        setOrderSuccess(true);
        setOrderId(generatedOrderId);
        
        // Reset form
        setFormData({
          name: "",
          contact: "",
          address: "",
          pincode: "",
          prescription_file_url: "",
          medicines: [],
        });
        setPrescriptionFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setOrderSuccess(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderSuccess(false);
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
      setShowResultModal(true);
    }
  };
  
  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.contact.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.pincode !== "" &&
      formData.medicines.length > 0
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl p-4 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Medicine Order Form</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Part 1: Customer Information */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label htmlFor="contact" className="text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-1 md:col-span-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">Delivery Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  rows={2}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label htmlFor="pincode" className="text-sm font-medium text-gray-700">Pincode</label>
                <select
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Pincode</option>
                  {pincodes.map((code) => (
                    <option key={code} value={code} className="text-gray-900">
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label htmlFor="prescription" className="text-sm font-medium text-gray-700">Upload Prescription (optional)</label>
                <input
                  type="file"
                  id="prescription"
                  ref={fileInputRef}
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG</p>
              </div>
            </div>
          </section>
          
          {/* Part 2: Medicines */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Medicines</h2>
            
            <div className="flex flex-col gap-6">
              {/* Add medicine form */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-3 flex flex-col gap-1">
                    <label htmlFor="medicineName" className="text-sm font-medium text-gray-700">Medicine Name</label>
                    <input
                      type="text"
                      id="medicineName"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max="50"
                      value={medicineQuantity}
                      onChange={(e) => setMedicineQuantity(parseInt(e.target.value) || 1)}
                      className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Add Medicine
                  </button>
                </div>
                
                <p className="text-sm text-gray-500">
                  Maximum quantity per medicine: 50
                </p>
              </div>
              
              {/* Medicine list */}
              <div className="mt-4">
                <h3 className="font-medium mb-2 text-gray-800">Added Medicines:</h3>
                
                {formData.medicines.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">
                    No medicines added yet
                  </p>
                ) : (
                  <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700">Sl No.</th>
                          <th className="px-4 py-2 text-left text-gray-700">Medicine Name</th>
                          <th className="px-4 py-2 text-left text-gray-700">Quantity</th>
                          <th className="px-4 py-2 text-left text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.medicines.map((medicine, index) => (
                          <tr key={index} className="border-t border-gray-300 bg-white">
                            <td className="px-4 py-2 text-gray-900 font-medium">{medicine.sl_no}</td>
                            <td className="px-4 py-2 text-gray-900 font-medium">{medicine.name}</td>
                            <td className="px-4 py-2 text-gray-900 font-medium">{medicine.quantity}</td>
                            <td className="px-4 py-2">
                              <button
                                type="button"
                                onClick={() => removeMedicine(index)}
                                className="text-red-700 hover:text-red-900 text-sm font-semibold"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>
          
          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              Place Order
            </button>
          </div>
        </form>
      </main>
      
      <Footer />
      
      {/* Confirmation Modal */}
      {showConfirmation && (
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
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmOrder}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Result Modal - to show success or failure after order submission */}
      {showResultModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
            {orderSuccess ? (
              <>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Order Placed Successfully!</h2>
                  <p className="text-gray-600 mt-2">Your order has been received and will be processed shortly.</p>
                  {orderId && (
                    <p className="mt-2 font-medium text-gray-800">
                      Order ID: <span className="text-blue-600">{orderId}</span>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Order Submission Failed</h2>
                  <p className="text-gray-600 mt-2">
                    There was an error processing your order. Please try again later or contact support.
                  </p>
                </div>
              </>
            )}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={closeResultModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {orderSuccess ? 'Continue Shopping' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}