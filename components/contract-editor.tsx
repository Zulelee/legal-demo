"use client";

import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  Clock,
  File,
  GripVertical,
  Pen,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

export function ContractEditor() {
  const [activeTemplate, setActiveTemplate] = useState("privacy-policy");
  const [activeSection, setActiveSection] = useState("introduction");
  const [showNotification, setShowNotification] = useState(false);
  const [editingSectionName, setEditingSectionName] = useState(null);
  const [sections, setSections] = useState({
    "privacy-policy": [
      "Introduction",
      "Data Collection",
      "Use of Data",
      "Data Sharing",
      "User Rights",
      "Security Measures",
      "Cookies Policy",
      "Changes to Policy",
      "Contact Information",
    ],
    nda: [
      "Parties",
      "Purpose",
      "Definition of Confidential Information",
      "Exclusions from Confidential Information",
      "Obligations of Receiving Party",
      "Term",
      "Remedies",
      "Miscellaneous",
    ],
    "terms-of-use": [
      "Acceptance of Terms",
      "User Eligibility",
      "User Account",
      "Intellectual Property Rights",
      "Prohibited Activities",
      "Termination",
      "Disclaimers",
      "Limitation of Liability",
      "Governing Law",
    ],
    "saas-agreement": [
      "Definitions",
      "License Grant and Restrictions",
      "Services",
      "Customer Responsibilities",
      "Fees and Payment",
      "Confidentiality",
      "Warranties",
      "Limitation of Liability",
      "Term and Termination",
      "General Provisions",
    ],
  });
  const [sectionContent, setSectionContent] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingSectionName !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingSectionName]);

  const handleSave = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const addSection = () => {
    const newSection = `New Section ${sections[activeTemplate].length + 1}`;
    setSections((prev) => ({
      ...prev,
      [activeTemplate]: [...prev[activeTemplate], newSection],
    }));
    setActiveSection(newSection.toLowerCase().replace(/ /g, "-"));
  };

  const removeSection = (index) => {
    setSections((prev) => ({
      ...prev,
      [activeTemplate]: prev[activeTemplate].filter((_, i) => i !== index),
    }));
  };

  const handleContentChange = (content) => {
    setSectionContent((prev) => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        [activeSection]: content,
      },
    }));
  };

  const startEditingSectionName = (index) => {
    setEditingSectionName(index);
  };

  const saveSectionName = (index, newName) => {
    const newSections = [...sections[activeTemplate]];
    newSections[index] = newName;
    setSections((prev) => ({
      ...prev,
      [activeTemplate]: newSections,
    }));
    setEditingSectionName(null);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(sections[activeTemplate]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections((prev) => ({
      ...prev,
      [activeTemplate]: items,
    }));
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <div className="p-4">
            <div className="pb-2">
              <Select value={activeTemplate} onValueChange={setActiveTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="privacy-policy">Privacy Policy</SelectItem>
                  <SelectItem value="nda">NDA</SelectItem>
                  <SelectItem value="terms-of-use">Terms of Use</SelectItem>
                  <SelectItem value="saas-agreement">SaaS Agreement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select className="mt-4">
              <SelectTrigger>
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v1.0">Version 1.0</SelectItem>
                <SelectItem value="v1.1">Version 1.1</SelectItem>
                <SelectItem value="v1.2">Version 1.2 (Current)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {sections[activeTemplate].map((section, index) => (
                        <Draggable
                          key={section}
                          draggableId={section}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center mb-2 group"
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="mr-2 px-1"
                              >
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                              {editingSectionName === index ? (
                                <Input
                                  ref={inputRef}
                                  value={section}
                                  onChange={(e) => {
                                    const newSections = [
                                      ...sections[activeTemplate],
                                    ];
                                    newSections[index] = e.target.value;
                                    setSections((prev) => ({
                                      ...prev,
                                      [activeTemplate]: newSections,
                                    }));
                                  }}
                                  onBlur={() => saveSectionName(index, section)}
                                  className="flex-grow mr-2"
                                />
                              ) : (
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start px-2 h-8 overflow-hidden"
                                  onClick={() =>
                                    setActiveSection(
                                      section.toLowerCase().replace(/ /g, "-")
                                    )
                                  }
                                >
                                  <span className="truncate">{section}</span>
                                </Button>
                              )}
                              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                {editingSectionName === index ? (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 px-1"
                                    onClick={() =>
                                      saveSectionName(index, section)
                                    }
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 px-1"
                                    onClick={() =>
                                      startEditingSectionName(index)
                                    }
                                  >
                                    <Pen className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 px-1"
                                  onClick={() => removeSection(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <Button onClick={addSection} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white p-4 flex justify-between items-center border-b">
            <div className="flex items-center space-x-4">
              <Input placeholder="Company Name" className="w-48" />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" className="w-40" />
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="outline">
                <Clock className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Bell className="h-4 w-4" />
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Preview</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[800px] w-[90vw] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {activeTemplate
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}{" "}
                      Preview
                    </DialogTitle>
                    <DialogDescription>
                      Review the full document
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    {sections[activeTemplate].map((section, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {section}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {sectionContent[activeTemplate]?.[
                            section.toLowerCase().replace(/ /g, "-")
                          ] ||
                            getDefaultContent(
                              activeTemplate,
                              section.toLowerCase().replace(/ /g, "-")
                            )}
                        </p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 p-6 bg-gray-100 overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeSection
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </CardTitle>
                <CardDescription>
                  Edit this section of your{" "}
                  {activeTemplate
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter the content for this section..."
                  className="min-h-[300px]"
                  value={
                    sectionContent[activeTemplate]?.[activeSection] ||
                    getDefaultContent(activeTemplate, activeSection)
                  }
                  onChange={(e) => handleContentChange(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Discard Changes</Button>
                <Button onClick={handleSave}>Update Section</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Version History */}
          <div className="bg-white border-t p-4">
            <Tabs defaultValue="recent">
              <TabsList>
                <TabsTrigger value="recent">Recent Changes</TabsTrigger>
                <TabsTrigger value="all">All Versions</TabsTrigger>
              </TabsList>
              <TabsContent value="recent">
                <div className="text-sm text-gray-500">
                  <p>
                    Version 1.2 - Updated{" "}
                    {activeTemplate
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}{" "}
                    (2 hours ago)
                  </p>
                  <p>Version 1.1 - Modified User Rights section (1 day ago)</p>
                </div>
              </TabsContent>
              <TabsContent value="all">
                <div className="text-sm text-gray-500">
                  <p>Version 1.2 - Current</p>
                  <p>Version 1.1 - June 15, 2023</p>
                  <p>Version 1.0 - January 1, 2023</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
            Changes saved successfully!
          </div>
        )}
      </div>
    </>
  );
}

function getDefaultContent(template, section) {
  const content = {
    "privacy-policy": {
      introduction: `This Privacy Policy describes how [Company Name] ("we", "us", or "our") collects, uses, and shares your personal information when you use our services.

We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services.`,
    },
    nda: {
      parties: `This Non-Disclosure Agreement (the "Agreement") is entered into by and between:

1. [Company Name], with its principal place of business at [address] ("Disclosing Party"), and
2. [Recipient Name], with its principal place of business at [address] ("Receiving Party").

Collectively referred to as the "Parties".`,
    },
    "terms-of-use": {
      "acceptance-of-terms": `Welcome to [Company Name]. By accessing or using our website, mobile application, or any of our services, you agree to be bound by these Terms of Use ("Terms"). 

If you disagree with any part of the terms, then you may not access our services.`,
    },
    "saas-agreement": {
      definitions: `"Agreement" means this Software as a Service (SaaS) Agreement and any exhibits, schedules, and addenda.

"Customer" means the entity or individual that purchases the Service from Provider.

"Service" means the [specific SaaS offering] and any associated services, as described in the Order Form.

"Provider" means [Company Name], the entity providing the Service.`,
    },
  };

  return (
    content[template]?.[section] || "Enter the content for this section..."
  );
}
