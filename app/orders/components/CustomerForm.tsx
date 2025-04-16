// File: app/orders/components/CustomerForm.tsx
"use client";

import { useRef } from "react";
import { OrderFormData } from "../page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define available pincodes
const pincodes = ["Dinhata", "Coochbehar", "Senet", "Bagdogra" , "Rampurhat" , "Paikar" , "Farakka" , "Raiganj"];

interface CustomerFormProps {
  formData: OrderFormData;
  updateCustomerInfoAction: (data: Partial<OrderFormData>) => void;
  prescriptionFile: File | null;
  updatePrescriptionFileAction: (file: File | null) => void;
}

export default function CustomerForm({
  formData,
  updateCustomerInfoAction,
  prescriptionFile,
  updatePrescriptionFileAction,
}: CustomerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateCustomerInfoAction({ [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    updateCustomerInfoAction({ [name]: value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      updatePrescriptionFileAction(e.target.files[0]);
    } else {
      updatePrescriptionFileAction(null);
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md bg-white text-gray-900"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
              Contact Number
            </Label>
            <Input
              id="contact"
              name="contact"
              type="tel"
              value={formData.contact}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md bg-white text-gray-900"
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Delivery Address
            </Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md bg-white text-gray-900"
              placeholder="Enter your full delivery address"
              rows={3}
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
              Pincode
            </Label>
            <Select
              value={formData.pincode}
              onValueChange={(value) => handleSelectChange("pincode", value)}
            >
              <SelectTrigger className="border border-gray-300 bg-white text-gray-900">
                <SelectValue placeholder="Select Pincode" />
              </SelectTrigger>
              <SelectContent>
                {/* Remove this line that has empty value */}
                {/* <SelectItem value="">Select Pincode</SelectItem> */}
                {pincodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="prescription" className="text-sm font-medium text-gray-700">
              Upload Prescription (optional)
            </Label>
            <Input
              id="prescription"
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-md bg-white text-gray-900"
            />
            <p className="text-xs text-gray-500">
              Accepted formats: PDF, JPG, PNG
            </p>
            {prescriptionFile && (
              <p className="text-xs text-green-600">
                Selected file: {prescriptionFile.name}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}