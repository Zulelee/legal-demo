"use client";

import React from "react";
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
import { useToast } from "@/components/hooks/use-toast";
import { Book, GitBranch } from "lucide-react";

export function MainDashboardComponent() {
  const router = useRouter();
  const { toast } = useToast();

  const navigateTo = (path: string, title: string) => {
    router.push(path);
    toast({
      title: `Navigating to ${title}`,
      description: `You are being redirected to the ${title} dashboard.`,
    });
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Main Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="mr-2 h-6 w-6" />
              Playbooks
            </CardTitle>
            <CardDescription>Manage and create your Playbooks</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>
              Access your collection of Playbooks for various processes and
              workflows.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => navigateTo("/playbook", "Playbooks")}
            >
              Go to Playbooks
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GitBranch className="mr-2 h-6 w-6" />
              Knowledge Graphs
            </CardTitle>
            <CardDescription>
              Explore and edit your Knowledge Graphs
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>
              View and manage your Knowledge Graphs representing complex
              relationships and data structures.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => navigateTo("/kg-dashboard", "Knowledge Graphs")}
            >
              Go to Knowledge Graphs
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
