import { z } from 'zod'; 
export const productSchema = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Invalid price format" }), // A simple regex for price format
    description: z.string().min(1, { message: "Description is required" }),
  });