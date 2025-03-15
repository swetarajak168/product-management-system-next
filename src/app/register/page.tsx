"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { myAppHook } from '@/context/AppProvider';
import { useRouter } from 'next/navigation';
import { RegisterFormData } from '@/components/types/register';
import { Loader } from 'lucide-react';
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator';


const Register = () => {

    const { register, isLoading, registerErrors } = myAppHook();
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterFormData>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });



    const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.password_confirmation);
        } catch (error) {
            console.log("Error: ", error);
        }
    };
    if (isLoading) {
        return <Loader />;  // Show the loader when isLoading is true
    }
    return (
        <div className='h-screen flex items-center justify-center'>
            <Card className='md:h-auto w-4xl  p-4 sm:p-8'>
                <CardHeader>


                    <CardDescription className='text-sm text-center text-accent-foreground'>
                        Enter details below
                    </CardDescription>
                </CardHeader>
                <CardContent className='px-2 sm:px-6'>
                    <div className="flex mb-3">
                        <div className="w-80 flex-none ">

                            <Label className='text-2xl'>Please Register to get started with product management system.</Label>
                        </div>
                        <div className="flex-1">

                            <form onSubmit={handleFormSubmit} className='space-y-3'>
                                <Input
                                    type='text'
                                    name='name'
                                    placeholder='Full Name'
                                    value={formData.name}
                                    onChange={handleOnChangeInput}

                                />
                                {registerErrors.name && <span className="text-sm text-red-500">{registerErrors.name}</span>}

                                <Input
                                    type='email'
                                    name='email'
                                    placeholder='Email'
                                    value={formData.email}
                                    onChange={handleOnChangeInput}

                                />
                                {registerErrors.email && <span className="text-sm text-red-500">{registerErrors.email}</span>}

                                <Input
                                    type='password'
                                    name='password'
                                    placeholder='Password'
                                    value={formData.password}
                                    onChange={handleOnChangeInput}

                                />

                                <Input
                                    type='password'
                                    name='password_confirmation'
                                    placeholder='Confirm Password'
                                    value={formData.password_confirmation}
                                    onChange={handleOnChangeInput}

                                />
                                {registerErrors.password_confirmation && <span className="text-sm text-red-500">{registerErrors.password_confirmation}</span>}

                                <Button className='bg-indigo-900 w-full' size="lg" disabled={false}>
                                    Register
                                </Button>
                            </form>
                        </div>
                    </div>
                    <Separator />

                    <p className='text-center text-sm mt-2 text-muted-foreground'>
                        Already have an account?
                        <Link className="text-sky-700 ml-4 hover:underline cursor-pointer" href="/login">
                            LogIn
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
