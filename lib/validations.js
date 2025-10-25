import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.enum(['snacks', 'beverages', 'gaming', 'accessories', 'services']),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  featured: z.boolean().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
});

export const orderSchema = z.object({
  customerInfo: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number is required'),
    address: z.object({
      street: z.string().min(1, 'Street is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      zipCode: z.string().min(1, 'ZIP code is required'),
      country: z.string().min(1, 'Country is required'),
    }),
  }),
  items: z.array(
    z.object({
      product: z.string(),
      quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'At least one item is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user']).optional(),
});
