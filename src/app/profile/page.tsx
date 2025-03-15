"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { myAppHook } from '@/context/AppProvider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader } from "lucide-react";
import { Button } from '@/components/ui/button';
import { RegisterFormData } from '@/components/types/login'


const Profile = () => {
    
    const { authToken, fetchUserData } = myAppHook();  
    const [user, setUser] = useState<RegisterFormData| null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userData = await fetchUserData(); // Get user data
                if (userData) {
                    setUser(userData); // Set the user state with the fetched data
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        if (authToken) {
            fetchData();
        } else {
            router.push("/login");
        }
    }, [authToken, router]);
    

    return (
        <>
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
                    {isLoading ? (
                        <Loader />  // Show loader while fetching user data
                    ) : user ? (
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src="/images/user-profile.jpg" alt="User Avatar" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <Separator orientation="vertical" />
                            <div>
                                <p className="text-lg font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p>No user data available</p>  
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default Profile;
