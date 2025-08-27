import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

type ProductFormProps = {
  product?: any; // if provided → edit mode
};

export default function ProductForm({ product }: ProductFormProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrl: "",
    categoryIds: [] as number[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || "",
        price: String(product.price),
        stockQuantity: String(product.stockQuantity),
        imageUrl: product.imageUrl || "",
        categoryIds: product.categories.map((c: any) => c.categoryId),
      });
    } else {
      // Reset form when opening for a new product
      setForm({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        imageUrl: "",
        categoryIds: [],
      });
    }
    setErrors({});
  }, [product, open]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) =>
      product
        ? api.put(`/products/${product.id}`, data)
        : api.post("/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
    },
    onError: (error: any) => {
      if (error.response?.data?.error) {
        setErrors({ submit: error.response.data.error });
      } else {
        setErrors({ submit: "An error occurred" });
      }
    },
  });

  const handleSubmit = () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!form.name) newErrors.name = "Name is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.stockQuantity) newErrors.stockQuantity = "Stock quantity is required";
    if (form.categoryIds.length === 0) newErrors.categoryIds = "At least one category is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    mutation.mutate({
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
    });
  };

  const addCategory = (categoryId: number) => {
    if (!form.categoryIds.includes(categoryId)) {
      setForm({
        ...form,
        categoryIds: [...form.categoryIds, categoryId],
      });
    }
    // Clear any category error when a category is selected
    if (errors.categoryIds) {
      setErrors({ ...errors, categoryIds: "" });
    }
  };

  const removeCategory = (categoryId: number) => {
    setForm({
      ...form,
      categoryIds: form.categoryIds.filter(id => id !== categoryId),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="outline" size="sm">Edit</Button>
        ) : (
          <Button>Add Product</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => {
                setForm({ ...form, price: e.target.value });
                if (errors.price) setErrors({ ...errors, price: "" });
              }}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          <div>
            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
            <Input
              id="stockQuantity"
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={(e) => {
                setForm({ ...form, stockQuantity: e.target.value });
                if (errors.stockQuantity) setErrors({ ...errors, stockQuantity: "" });
              }}
            />
            {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="categorySelect">Categories *</Label>
            <Select
              onValueChange={(val) => addCategory(Number(val))}
            >
              <SelectTrigger id="categorySelect">
                <SelectValue placeholder="Select categories" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  ?.filter((cat: any) => !form.categoryIds.includes(cat.id))
                  .map((cat: any) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.categoryIds && <p className="text-red-500 text-sm mt-1">{errors.categoryIds}</p>}
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.categoryIds.map((id) => {
                const cat = categories?.find((c: any) => c.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded text-sm"
                  >
                    {cat?.name}
                    <button
                      type="button"
                      onClick={() => removeCategory(id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
          <Button 
            onClick={handleSubmit} 
            disabled={mutation.isLoading}
            className="w-full"
          >
            {mutation.isLoading ? "Processing..." : (product ? "Update" : "Save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}