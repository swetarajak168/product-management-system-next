"use client";

import { Children, createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/validations/register';
import { loginSchema } from '@/validations/login';
import { AuthProviderType } from '@/components/types/auth';


const AppContext = createContext<AuthProviderType | undefined>(undefined);
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const AppProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [authToken, setAuthToken] = useState<string | null>(null)
    const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
    const [registerErrors, setRegisterErrors] = useState<{ name?: string; email?: string; password?: string; password_confirmation?: string }>({});

    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          setAuthToken(token);
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }, []);
   

    const login = async (email: string, password: string) => {
        try {

            setIsLoading(true);
            const validationResult = loginSchema.safeParse({ email, password });
            if (!validationResult.success) {
                const errors = validationResult.error.format();

                setLoginErrors({
                    email: errors.email?._errors[0],
                    password: errors.password?._errors[0],
                });
                return;
            }
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.access_token) {
                localStorage.setItem('auth_token', data.access_token);
            } else {
                console.error("Token not found in response.");
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const register = async (name: string, email: string, password: string, password_confirmation: string) => {

        try {
            setIsLoading(true);

            // Validate input data using Zod
            const validationResult = registerSchema.safeParse({ name, email, password, password_confirmation });

            if (!validationResult.success) {
                const errors = validationResult.error.format();

                setRegisterErrors({
                    name: errors.name?._errors[0],
                    email: errors.email?._errors[0],
                    password: errors.password?._errors[0],
                    password_confirmation: errors.password_confirmation?._errors[0],
                });
                return; 
            }

            const response = await fetch(`${API_URL}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('auth_token', data.token);
                router.push('/dashboard')
              
            } 
            
        } catch (error) {
            console.error("Register error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    //api call for login
    const logout = async () => {
        try {
            
            setIsLoading(true);
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            localStorage.removeItem('auth_token');
            setAuthToken(null);
            router.push('/login');

        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoading(false);

        }
    }

    //api call for authenticated user
    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                credentials: 'include'
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
    
            const data = await response.json();
            return data; // <-- Return the user data here
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <AppContext.Provider value={{ login, register, isLoading, authToken, logout, loginErrors, registerErrors, fetchUserData }}>
            {children}
        </AppContext.Provider>
    )


}
export const myAppHook = () => {
    const context = useContext(AppContext)
    return context;
}
