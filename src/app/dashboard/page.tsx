"use client"
import React, { useState, useEffect } from 'react';
import { myAppHook } from '@/context/AppProvider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import Loader from "@/components/Loader";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { productSchema } from '@/validations/products';
import Products from '@/components/Products';
import { ProductFormData } from '@components/types/ProductFormData';


const Dashboard = () => {
    const { authToken, } = myAppHook();
    const router = useRouter();
    const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        price: "",
        description: "",
    });

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

    useEffect(() => {
        if (authToken) {

            fetchAllProducts()
        }
    }, [authToken])


    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        price: "",
        description: ""
    });

    const [products, setProducts] = useState<ProductFormData[]>([])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({
            name: "",
            price: "",
            description: "",
        });

        try {

            productSchema.parse(formData);
            setIsLoading(true);

        } catch (error: any) {
            const errorMessages = error.errors.reduce((acc: any, current: any) => {
                acc[current.path[0]] = current.message;
                return acc;
            }, {});
            setErrors(errorMessages);
            return;
        }
        const url = editingProduct
            ? `${API_URL}/products/${editingProduct.id}`
            : `${API_URL}/products`;
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to add product');

            const data = await response.json();
            fetchAllProducts();
            setFormData({ name: "", price: "", description: "" });
            setEditingProduct(null);
            setOpenModal(false);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }

    const fetchAllProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data);

        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleEdit = (product: ProductFormData) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description
        });
        setOpenModal(true);
    }

    const handleDelete = async (productId: number) => {
        try {
            const response = await fetch(`${API_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to delete product');

            fetchAllProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        } finally {
            setIsLoading(false);
        }
    }
    const handleView = (product: ProductFormData) => {
        console.log(product.id)
        router.push(`/products/${product.id}`);
    };



    if (isLoading) {
        return <Loader />;
    }
    return (
        <>

            <div className="flex justify-end w-[80%] mx-auto my-4">
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-900 text-white px-4 py-2 rounded-md" onClick={() => {
                            setEditingProduct(null);
                            setFormData({ name: "", price: "", description: "" });
                            setOpenModal(true);
                        }}>

                            Add Product  <Plus />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">
                                {editingProduct ? "Edit Product" : "Add Product"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingProduct ? "Update product details." : "Fill in the details to add a new product."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                            <Input
                                type="text"
                                name="price"
                                placeholder="Product Price"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                            {errors.price && <span className="text-sm text-red-500">{errors.price}</span>}

                            <Textarea
                                name="description"
                                placeholder="Product Description"
                                value={formData.description}
                                onChange={handleInputChange}

                            />
                            {errors.description && <span className="text-sm text-red-500">{errors.description}</span>}

                            <DialogFooter>
                                <Button type="submit" className="bg-indigo-900 text-white px-4 py-2 rounded-md">
                                    {editingProduct ? "Update " : "Add "}
                                </Button>
                                <DialogClose asChild>
                                    <Button type="button" className="bg-rose-800 ml-2 border px-4 py-2 rounded-md" onClick={() => {
                                        setErrors({ name: "", price: "", description: "" }); // Clear errors on cancel
                                    }}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Products
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
            />
        </>
    )
}

export default Dashboard;
