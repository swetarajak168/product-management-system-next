"use client"
import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import {
    Card, CardHeader, CardDescription, CardContent, CardTitle
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { myAppHook } from '@/context/AppProvider';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { LoginFormData } from '@/components/types/login'
import { Label } from '@/components/ui/label'

const LogIn = () => {

    const { login, isLoading, loginErrors } = myAppHook();
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });
    const router = useRouter();

    const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            router.push("/dashboard")

        } catch (error) {
            console.log("Error: ", error);
        }
    };
    if (isLoading) {
        return <Loader />;  // Show the loader when isLoading is true
    }
    return (
        <div className='h-screen flex items-center justify-center  '>
            <Card className='md:h-auto w-4xl  p-4 sm:p-8'>
                <CardHeader className='text-center'>
                   

                    <CardDescription className='text-sm text-center text-accent-foreground'>
                        Enter Your Credentials to login
                    </CardDescription>
                </CardHeader>
                <CardContent className='px-2 sm:px-6'>

                    <div className="flex mb-3">
                        <div className="w-80 flex-none ">

                            <Label className='text-2xl'>Log In to manage your products.</Label>
                        </div>
                        <div className="flex-1">

                            <form action="" className='space-y-3' onSubmit={handleFormSubmit}>
                                <Input type='email' disabled={false} name='email' placeholder='Email' value={formData.email} onChange={handleOnChangeInput} ></Input>
                                {loginErrors.email && <span className="text-sm text-red-500">{loginErrors.email}</span>}

                                <Input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleOnChangeInput} ></Input>
                                {loginErrors.password && <span className="text-sm text-red-500">{loginErrors.password}</span>}

                                <Button className='bg-indigo-900 w-full' size="lg" disabled={false}>LogIn</Button>
                            </form>
                        </div>
                    </div>

                    <Separator />

                    <p className='text-center text-sm mt-2 text-muted-foreground'>
                        Create new account?
                        <Link className="text-sky-700 ml-4 hover:underline cursor-pointer " href="/register">Register</Link>

                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default LogIn;