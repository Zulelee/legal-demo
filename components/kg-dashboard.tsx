"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/hooks/use-toast";
import { Edit, Plus } from "lucide-react";

interface KnowledgeGraph {
  id: string;
  name: string;
  creator: string;
  lastUpdated: string;
}

const mockKnowledgeGraphs: KnowledgeGraph[] = [
  {
    id: "1",
    name: "Industry X KG",
    creator: "John Doe",
    lastUpdated: "2023-06-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Industry Y KG",
    creator: "Jane Smith",
    lastUpdated: "2023-06-14T14:45:00Z",
  },
  {
    id: "3",
    name: "Industry Z KG",
    creator: "Alice Johnson",
    lastUpdated: "2023-06-13T09:15:00Z",
  },
];

export function KgDashboard() {
  const [knowledgeGraphs, setKnowledgeGraphs] =
    useState<KnowledgeGraph[]>(mockKnowledgeGraphs);
  const [newKGName, setNewKGName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateKG = () => {
    if (newKGName.trim()) {
      const newKG: KnowledgeGraph = {
        id: (knowledgeGraphs.length + 1).toString(),
        name: newKGName.trim(),
        creator: "Current User", // In a real app, this would be the logged-in user
        lastUpdated: new Date().toISOString(),
      };
      setKnowledgeGraphs([...knowledgeGraphs, newKG]);
      setNewKGName("");
      setIsCreateDialogOpen(false);
      toast({
        title: "Knowledge Graph Created",
        description: `"${newKG.name}" has been successfully created.`,
      });
    }
  };

  const handleEditKG = (id: string) => {
    // In a real app, this would navigate to the edit page for the specific KG
    router.push(`/kg`);
    toast({
      title: "Editing Knowledge Graph",
      description: "You are now editing the selected Knowledge Graph.",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Knowledge Graph Dashboard
          </CardTitle>
          <CardDescription>
            Manage and create your Knowledge Graphs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Knowledge Graphs</h2>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New KG
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Knowledge Graph</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new Knowledge Graph.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newKGName}
                      onChange={(e) => setNewKGName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateKG}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {knowledgeGraphs.map((kg) => (
                <TableRow key={kg.id}>
                  <TableCell className="font-medium">{kg.name}</TableCell>
                  <TableCell>{kg.creator}</TableCell>
                  <TableCell>
                    {new Date(kg.lastUpdated).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" onClick={() => handleEditKG(kg.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
