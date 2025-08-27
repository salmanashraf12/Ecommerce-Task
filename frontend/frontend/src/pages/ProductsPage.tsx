import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductForm from "@/components/ProductForm";
import { ImageIcon, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch categories for filter dropdown
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories")).data,
  });

  // Fetch products with pagination + filter
  const { data, isLoading } = useQuery({
    queryKey: ["products", page, categoryId],
    queryFn: async () => {
      const params: any = { page, limit: 5 };
      if (categoryId) params.categoryId = categoryId;
      
      const res = await api.get("/products", { params });
      return res.data;
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <ProductForm />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <Select 
          onValueChange={(val) => {
            setCategoryId(val === "all" ? null : val);
            setPage(1);
          }} 
          value={categoryId || "all"}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat: any) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((product: any) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.stockQuantity}</TableCell>
              <TableCell>
                {product.description ? (
                  <div className="max-w-xs">
                    <p className="truncate" title={product.description}>
                      {product.description}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto text-xs">
                          View full description
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Product Description</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <p className="whitespace-pre-wrap">{product.description}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No description</span>
                )}
              </TableCell>
              <TableCell>
                {product.categories?.map((pc: any) => pc.category.name).join(", ")}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <ProductForm product={product} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={deleteProductMutation.isLoading}
                  >
                    Delete
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{product.name} - Full Details</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          {product.imageUrl && (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-500">Name</h4>
                            <p>{product.name}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-500">Price</h4>
                            <p>${product.price}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-500">Stock Quantity</h4>
                            <p>{product.stockQuantity}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-500">Categories</h4>
                            <p>{product.categories?.map((pc: any) => pc.category.name).join(", ")}</p>
                          </div>
                          {product.description && (
                            <div>
                              <h4 className="font-semibold text-sm text-gray-500">Description</h4>
                              <p className="whitespace-pre-wrap mt-1">{product.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span>
          Page {data?.page} of {data?.totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === data?.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}