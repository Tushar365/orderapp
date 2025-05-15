"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Doc } from '@/convex/_generated/dataModel';

// Define the shape of a cart item
export type CartItem = Doc<"products"> & { quantity: number };

// Define the shape of the cart context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Doc<"products">, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  // Add other cart actions here later (e.g., updateQuantity)
}

// Create the context with a default value (can be null or an initial state)
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Always initialize with an empty array

  // Effect to load cart from localStorage on initial mount (client-side only)
  useEffect(() => {
    // Ensure this runs only on the client-side
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error parsing cart items from localStorage:", error);
          // Optionally clear invalid data from localStorage
          localStorage.removeItem('cartItems');
        }
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to save cart to localStorage whenever it changes
  useEffect(() => {
    // Ensure this runs only on the client-side
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]); // Dependency array ensures this runs whenever cartItems changes

  const addToCart = useCallback((product: Doc<"products">, quantity: number) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item._id === product._id);
      let updatedItems;
      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item to cart
        updatedItems = [...prevItems, { ...product, quantity }];
      }
      // Log the updated cart state here
      console.log(`Added ${quantity} of ${product.Product_Name}. Updated cart:`, updatedItems);
      return updatedItems;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item._id !== productId);
      console.log(`Removed item with ID ${productId}. Updated cart:`, updatedItems);
      return updatedItems;
    });
  }, []);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    // Add other functions here
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Create a custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};