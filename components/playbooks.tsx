"use client";

import { useState } from "react";
import Link from "next/link";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Plus, Search, Eye } from "lucide-react";

export function PlaybooksComponent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const playbooks = [
    {
      id: 1,
      name: "Privacy Policy",
      lastEdited: "2023-06-28T14:30:00Z",
      editedBy: "John Doe",
      content: `This Privacy Policy describes how [Company Name] ("we", "us", or "our") collects, uses, and shares your personal information when you use our services.

We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services.

1. Information We Collect
2. How We Use Your Information
3. Information Sharing and Disclosure
4. Your Rights and Choices
5. Data Security
6. Children's Privacy
7. Changes to This Privacy Policy
8. Contact Us

Last updated: [Date]`,
    },
    {
      id: 2,
      name: "Non-Disclosure Agreement (NDA)",
      lastEdited: "2023-06-27T09:15:00Z",
      editedBy: "Jane Smith",
      content: `This Non-Disclosure Agreement (the "Agreement") is entered into by and between:

1. [Company Name], with its principal place of business at [address] ("Disclosing Party"), and
2. [Recipient Name], with its principal place of business at [address] ("Receiving Party").

1. Definition of Confidential Information
2. Obligations of Receiving Party
3. Exclusions from Confidential Information
4. Term
5. Return of Confidential Information
6. No Rights Granted
7. Remedies
8. Miscellaneous

IN WITNESS WHEREOF, the parties have executed this Non-Disclosure Agreement as of the date first above written.

[Signature blocks]`,
    },
    {
      id: 3,
      name: "Terms of Use",
      lastEdited: "2023-06-26T16:45:00Z",
      editedBy: "Alice Johnson",
      content: `Welcome to [Company Name]. By accessing or using our website, mobile application, or any of our services, you agree to be bound by these Terms of Use ("Terms"). 

1. Acceptance of Terms
2. Changes to Terms
3. Access to the Service
4. User Account
5. User Content
6. Prohibited Activities
7. Intellectual Property Rights
8. Disclaimer of Warranties
9. Limitation of Liability
10. Governing Law
11. Contact Information

Last updated: [Date]`,
    },
    {
      id: 4,
      name: "SaaS Agreement",
      lastEdited: "2023-06-25T11:20:00Z",
      editedBy: "Bob Williams",
      content: `This Software as a Service (SaaS) Agreement (the "Agreement") is entered into by and between [Company Name] ("Provider") and the entity or individual ("Customer") who completes the registration process for the Service.

1. Definitions
2. License Grant and Restrictions
3. Service Levels
4. Customer Responsibilities
5. Fees and Payment
6. Confidentiality
7. Warranties and Disclaimers
8. Limitation of Liability
9. Term and Termination
10. General Provisions

Last updated: [Date]`,
    },
  ];

  const filteredPlaybooks = playbooks.filter((playbook) =>
    playbook.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Legal Playbooks</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search playbooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Playbook
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaybooks.map((playbook) => (
              <Card key={playbook.id}>
                <CardHeader>
                  <CardTitle>{playbook.name}</CardTitle>
                  <CardDescription>
                    Last edited on{" "}
                    {new Date(playbook.lastEdited).toLocaleDateString()} by{" "}
                    {playbook.editedBy}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[800px] w-[90vw] max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>{playbook.name} Preview</DialogTitle>
                        <DialogDescription>
                          Last edited on{" "}
                          {new Date(playbook.lastEdited).toLocaleDateString()}{" "}
                          by {playbook.editedBy}
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="mt-4 border rounded p-4 h-[calc(80vh-200px)]">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {playbook.content}
                        </pre>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                  <Link
                    // href={`/contract-editor?template=${playbook.name
                    //   .toLowerCase()
                    //   .replace(/ /g, "-")}`}
                    href={`/contract`}
                  >
                    <Button>Edit Playbook</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
