// File: app/orders/components/MedicineList.tsx
"use client";

import { Medicine } from "../page"; // Ensure this path is correct
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
              <TableHead className="text-gray-700 w-[5%]">Sl.</TableHead>
              <TableHead className="text-gray-700 w-[25%]">Medicine Name</TableHead>
              <TableHead className="text-gray-700 w-[15%]">Brand</TableHead>
              <TableHead className="text-gray-700 text-right w-[10%]">MRP</TableHead>
              <TableHead className="text-gray-700 text-right w-[10%]">Discount</TableHead>
              <TableHead className="text-gray-700 text-right w-[10%]">Price</TableHead>
              <TableHead className="text-gray-700 text-center w-[10%]">Qty</TableHead>
              <TableHead className="text-gray-700 text-right w-[10%]">Total</TableHead>
              <TableHead className="text-gray-700 text-center w-[5%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((medicine, index) => (
              <TableRow key={index} className="border-t border-gray-200 bg-white hover:bg-gray-50">
                <TableCell className="text-gray-900 font-medium text-center">{medicine.sl_no}</TableCell>
                <TableCell className="text-gray-900 font-medium">{medicine.name}</TableCell>
                <TableCell className="text-gray-600 text-sm">{medicine.brandName}</TableCell>
                <TableCell className="text-gray-600 text-right line-through">₹{medicine.mrp.toFixed(2)}</TableCell>
                <TableCell className="text-green-600 text-right text-sm">{medicine.discount ? `${medicine.discount.toFixed(1)}%` : '-'}</TableCell>
                <TableCell className="text-gray-900 font-semibold text-right">₹{medicine.price.toFixed(2)}</TableCell>
                <TableCell className="text-gray-900 text-center">{medicine.quantity}</TableCell>
                <TableCell className="text-gray-900 font-semibold text-right">₹{(medicine.price * medicine.quantity).toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    onClick={() => onRemoveAction(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 w-8"
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
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