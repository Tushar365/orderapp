// File: app/orders/components/MedicineList.tsx
"use client";

import { Medicine } from "../page";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MedicineListProps {
  medicines: Medicine[];
  onRemoveAction: (index: number) => void;
}

export default function MedicineList({ medicines, onRemoveAction }: MedicineListProps) {
  if (medicines.length === 0) {
    return (
      <div className="mt-4">
        <h3 className="font-medium mb-2 text-gray-800">Added Medicines:</h3>
        <p className="text-gray-500 italic text-sm p-4 border border-gray-200 rounded-md bg-gray-50">
          No medicines added yet. Please add at least one medicine to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2 text-gray-800">Added Medicines:</h3>
      
      <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-gray-700">Sl No.</TableHead>
              <TableHead className="text-gray-700">Medicine Name</TableHead>
              <TableHead className="text-gray-700">Quantity</TableHead>
              <TableHead className="text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((medicine, index) => (
              <TableRow key={index} className="border-t border-gray-300 bg-white">
                <TableCell className="text-gray-900 font-medium">{medicine.sl_no}</TableCell>
                <TableCell className="text-gray-900 font-medium">{medicine.name}</TableCell>
                <TableCell className="text-gray-900 font-medium">{medicine.quantity}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    onClick={() => onRemoveAction(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-700 hover:text-red-900 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}