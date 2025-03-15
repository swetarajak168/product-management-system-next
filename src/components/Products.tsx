import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 ,Eye} from "lucide-react"; // Import icons

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card, CardContent
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Label } from '@radix-ui/react-label';
const Products = ({ products, onEdit, onDelete, onView }) => {
    return (
        <div className="w-full mx-auto my-4">
            <Card className="m-3 w-[80%] mx-auto border rounded-lg shadow-md">
                <CardContent>
                    <div className="flex  justify-center mb-3">
                        <Label className="text-xl font-semibold text-gray-800">Your Products</Label>
                    </div>


                    <Table className="w-full text-sm text-left ">
                        <TableHeader className="bg-indigo-400 ">
                            <TableRow>
                                <TableCell className="py-3 px-4 text-white">Name</TableCell>
                                <TableCell className="py-3 px-4 text-white">Price</TableCell>
                                <TableCell className="py-3 px-4 text-white">Description</TableCell>
                                <TableCell className="py-3 px-4 text-white">Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell className="p-2">
                                        <TooltipProvider>
                                        <Tooltip>
                                                <TooltipTrigger>
                                                    <Button variant="ghost" className="text-blue-500 hover:text-blue-600 p-2" onClick={() => onView(product)}>
                                                        <Eye size={20} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button variant="ghost" className="text-blue-500 hover:text-blue-600 p-2" onClick={() => onEdit(product)}>
                                                        <Edit size={20} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit </p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button variant="ghost" className="text-red-500 hover:text-red-600 p-2" onClick={() => onDelete(product.id)}>
                                                        <Trash2 size={20} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>


                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Products;
