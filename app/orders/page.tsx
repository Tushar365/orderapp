// File: app/orders/page.tsx
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MedicineForm from "./components/MedicineForm";
import CustomerForm from "@/app/orders/components/CustomerForm";
import ConfirmationModal from "@/app/orders/components/ConfirmationModal";
import ResultModal from "@/app/orders/components/ResultModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Define types
export type Medicine = {
  sl_no: number;
  name: string;
  quantity: number;
};

export type OrderFormData = {
  name: string;
  contact: string;
  address: string;
  pincode: string;
  prescription_file_url?: string;
  medicines: Medicine[];
};

export default function OrderPage() {
  // Form state
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    contact: "",
    address: "",
    pincode: "",
    prescription_file_url: "",
    medicines: [],
  });
  
  // File state
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  
  // UI state
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Medicines, 2: Customer Info
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Form step handlers
  const goToNextStep = () => setCurrentStep(currentStep + 1);
  const goToPreviousStep = () => setCurrentStep(currentStep - 1);
  
  // State update handlers
  const updateMedicines = (medicines: Medicine[]) => {
    setFormData({
      ...formData,
      medicines,
    });
  };
  
  const updateCustomerInfo = (customerData: Partial<OrderFormData>) => {
    setFormData({
      ...formData,
      ...customerData,
    });
  };
  
  const updatePrescriptionFile = (file: File | null) => {
    setPrescriptionFile(file);
  };
  
  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };
  
  const confirmOrder = async () => {
    try {
      setIsSubmitting(true);
      
      // Generate order ID
      const timestamp = new Date().getTime();
      const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const generatedOrderId = `ORD-${timestamp}-${randomId}`;
      
      // Upload prescription if available
      let prescriptionFileUrl = "";
      if (prescriptionFile) {
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
      
      // Submit order
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
  
  // Form validation
  const isMedicinesValid = formData.medicines.length > 0;
  const isCustomerFormValid = 
    formData.name.trim() !== "" &&
    formData.contact.trim() !== "" &&
    formData.address.trim() !== "" &&
    formData.pincode !== "";
  
  // Rendering
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl p-4 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Medicine Order Form</h2>
        
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${currentStep === 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
              1
            </div>
            <div className="h-1 w-16 bg-gray-300"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${currentStep === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
              2
            </div>
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span className={`mx-6 ${currentStep === 1 ? "font-bold" : ""}`}>Medicines</span>
            <span className={`mx-6 ${currentStep === 2 ? "font-bold" : ""}`}>Customer Info</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Medicines Form */}
          {currentStep === 1 && (
            <>
              <MedicineForm 
                medicines={formData.medicines}
                updateMedicinesAction={updateMedicines}
              />
              
              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!isMedicinesValid}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Customer Info <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          
          {/* Step 2: Customer Information */}
          {currentStep === 2 && (
            <>
              <CustomerForm 
                formData={formData}
                updateCustomerInfoAction={updateCustomerInfo}
                prescriptionFile={prescriptionFile}
                updatePrescriptionFileAction={updatePrescriptionFile}
              />
              
              <div className="mt-6 flex justify-between">
                <Button
                  type="button"
                  onClick={goToPreviousStep}
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Medicines
                </Button>
                
                <Button
                  type="submit"
                  disabled={!isCustomerFormValid}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Review Order
                </Button>
              </div>
            </>
          )}
        </form>
      </main>
      
      <Footer />
      
      {/* Modals */}
      {showConfirmation && (
        <ConfirmationModal
          formData={formData}
          prescriptionFile={prescriptionFile}
          onCancelAction={() => setShowConfirmation(false)}
          onConfirmAction={confirmOrder}
          isSubmitting={isSubmitting}
        />
      )}
      
      {showResultModal && (
        <ResultModal
          success={orderSuccess}
          orderId={orderId}
          onCloseAction={() => setShowResultModal(false)}
        />
      )}
    </div>
  );
}