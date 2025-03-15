"use client"

import React, { useEffect, useState } from "react";
import { myAppHook } from "@/context/AppProvider";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NavMenu = () => {
    const { authToken, logout } = myAppHook();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Set the component to be mounted after the initial render
    }, []);

    if (!mounted) return null; // Avoid rendering until after the initial render
    const handleLogout=()=>{
        logout()

    }
    return (
        <>
            {authToken && (
                <div className="mt-3 flex justify-end items-center bg-blue-900  p-4 shadow-lg">
                    <NavigationMenu className="relative">
                        <NavigationMenuList className="flex space-x-6 items-center">
                            <NavigationMenuItem className="flex items-center space-x-4">
                                <div className="flex items-center space-x-4">                       
                                    <Link
                                        className="text-white hover:underline font-medium"
                                        href="/profile"
                                    >
                                        Profile
                                    </Link>
                                </div>

                                <Button
                                    variant="ghost"
                                    className="bg-transparent text-white hover:bg-sky-700 hover:text-white transition duration-200"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </Button>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            )}
        </>
    );
};

export default NavMenu;
