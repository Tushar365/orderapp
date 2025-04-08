// File: app/orders/components/MedicineForm.tsx
"use client";

import { useState } from "react";
import { Medicine } from "../page";
import MedicineList from "@/app/orders/components/MedicineList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface MedicineFormProps {
  medicines: Medicine[];
  updateMedicinesAction: (medicines: Medicine[]) => void;
}

export default function MedicineForm({ medicines, updateMedicinesAction }: MedicineFormProps) {
  const [medicineName, setMedicineName] = useState("");
  const [medicineQuantity, setMedicineQuantity] = useState(1);
  
  const addMedicine = () => {
    if (!medicineName.trim()) return;
    
    const newMedicine: Medicine = {
      sl_no: medicines.length + 1,
      name: medicineName.trim(),
      quantity: Math.min(Math.max(1, medicineQuantity), 50),
    };
    
    updateMedicinesAction([...medicines, newMedicine]);
    
    // Reset inputs
    setMedicineName("");
    setMedicineQuantity(1);
  };
  
  const removeMedicine = (index: number) => {
    const updatedMedicines = [...medicines];
    updatedMedicines.splice(index, 1);
    
    const renumberedMedicines = updatedMedicines.map((med, idx) => ({
      ...med,
      sl_no: idx + 1,
    }));
    
    updateMedicinesAction(renumberedMedicines);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && medicineName.trim()) {
      e.preventDefault();
      addMedicine();
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Add Medicines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Add medicine form */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-3 flex flex-col gap-1">
                <Label htmlFor="medicineName" className="text-sm font-medium text-gray-700">
                  Medicine Name
                </Label>
                <Input
                  id="medicineName"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-900"
                  placeholder="Enter medicine name"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => setMedicineQuantity(Math.max(1, medicineQuantity - 1))}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={50}
                    value={medicineQuantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setMedicineQuantity(Math.min(Math.max(1, value), 50));
                    }}
                    className="w-20 text-center p-2 border border-gray-300 rounded-md bg-white text-gray-900"
                  />
                  <Button
                    type="button"
                    onClick={() => setMedicineQuantity(Math.min(50, medicineQuantity + 1))}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <Button
                type="button"
                onClick={addMedicine}
                disabled={!medicineName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Medicine
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Maximum quantity per medicine: 50
            </p>
          </div>
          
          {/* Medicine list */}
          <MedicineList medicines={medicines} onRemoveAction={removeMedicine} />
        </div>
      </CardContent>
    </Card>
  );
}