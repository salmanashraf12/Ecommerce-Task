import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function Categories() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  // Add category
  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      await api.post("/categories", { name });
    },
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  // Update category
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      await api.put(`/categories/${id}`, { name });
    },
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  // Delete category
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      {/* Add new category */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Category</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="mb-3"
          />
          <Button
            onClick={() => {
              addMutation.mutate(newName);
              setNewName("");
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      {/* List categories */}
      <div className="grid gap-4 mt-6">
        {categories.map((cat: any) => (
          <Card key={cat.id} className="p-4 flex justify-between items-center">
            {editId === cat.id ? (
              <div className="flex gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <Button
                  onClick={() => {
                    updateMutation.mutate({ id: cat.id, name: editName });
                    setEditId(null);
                  }}
                >
                  Save
                </Button>
              </div>
            ) : (
              <>
                <span>{cat.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditId(cat.id);
                      setEditName(cat.name);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(cat.id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Categories;
