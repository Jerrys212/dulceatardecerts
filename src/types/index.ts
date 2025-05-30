import { z } from "zod";

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
    rememberMe: z.boolean().default(false),
});

export const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    permissions: z.array(z.string()),
});

export type User = z.infer<typeof userSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;

export const categorySchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    subCategories: z.array(z.string()),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const categoriesSchema = z.array(categorySchema);

export type Category = z.infer<typeof categorySchema>;

export type CategoryFormData = Pick<Category, "name" | "description" | "subCategories">;

export const productSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    category: categorySchema.pick({ _id: true, name: true }),
    subCategory: z.string(),
    price: z.number(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const productsSchema = z.array(productSchema);
export type Product = z.infer<typeof productSchema>;
export type ProductFormData = Omit<Product, "_id" | "isActive" | "createdAt" | "updatedAt" | "category"> & {
    category: string;
};

// Schema para un item de la venta
const SaleItemSchema = z.object({
    product: z.string(),
    extras: z.array(z.string()),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    subtotal: z.number(),
});

// Schema completo de la venta
export const SaleSchema = z.object({
    _id: z.string(),
    customer: z.string(),
    items: z.array(SaleItemSchema),
    total: z.number(),
    seller: z.object({
        _id: z.string(),
        username: z.string(),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const SalesSchema = z.array(SaleSchema);

export type SaleItem = z.infer<typeof SaleItemSchema>;
export type Sale = z.infer<typeof SaleSchema>;

export type MenuItem = {
    name: string;
    path: string;
    icon: React.ReactNode;
    label: string;
    description: string;
};

export type MenuCard = {
    name: string;
    path: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    bgColor: string;
    textColor: string;
};
