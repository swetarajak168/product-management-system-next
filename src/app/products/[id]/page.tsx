'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Loader from "@/components/Loader";
import { myAppHook } from '@/context/AppProvider';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";


const ProductDetail = () => {
    const { id } = useParams();
    const { authToken } = myAppHook();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    0
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

    useEffect(() => {
        if (!id) return;
        fetchProduct();
    }, [id]);
    const fetchProduct = async () => {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch product, status code: ${response.status}`);
            }

            const data = await response.json();

            setProduct(data);
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setIsLoading(false);
        }
    };


    if (isLoading) {
        return <Loader />;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="product-detail">
              <div className="p-3 mx-auto flex justify-start w-[80%] mx-auto my-4">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="bg-indigo-900 text-white"
                >
                   <ArrowLeft /> Back
                </Button>
            </div>
            <Card className="m-3 w-[80%] mx-auto border rounded-lg shadow-md">
                <CardContent>

                    <h1 className="text-xl font-bold">{product.name}</h1>
                    <div className="product-price">Price: {product.price}</div>
                    <div className="product-description">{product.description}</div>
                </CardContent>
            </Card>

            
        </div>
    );
};

export default ProductDetail;
