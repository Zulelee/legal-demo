"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import { useToast } from "@/components/hooks/use-toast";

const nodes = [
  { id: 1, label: "Contracts", x: 20, y: 20 },
  { id: 2, label: "Clauses", x: 80, y: 40 },
  { id: 3, label: "Parties", x: 30, y: 70 },
  { id: 4, label: "Terms", x: 70, y: 80 },
  { id: 5, label: "Compliance", x: 50, y: 10 },
];

const edges = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 5 },
];

const AnimatedNode = ({ id, label, x, y, isVisible }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
    transition={{ duration: 0.5 }}
    className="absolute bg-white rounded-full shadow-lg p-3 text-sm font-semibold text-blue-600"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    {label}
  </motion.div>
);

const AnimatedEdge = ({ from, to, nodes, isVisible }) => {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);

  if (!fromNode || !toNode) return null;

  return (
    <motion.svg
      initial={{ pathLength: 0, opacity: 0 }}
      animate={
        isVisible
          ? { pathLength: 1, opacity: 1 }
          : { pathLength: 0, opacity: 0 }
      }
      transition={{ duration: 1 }}
      className="absolute top-0 left-0 w-full h-full"
      style={{ zIndex: -1 }}
    >
      <motion.line
        x1={`${fromNode.x}%`}
        y1={`${fromNode.y}%`}
        x2={`${toNode.x}%`}
        y2={`${toNode.y}%`}
        stroke="#4299e1"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    </motion.svg>
  );
};

export function FlowLegalLogin() {
  const [visibleElements, setVisibleElements] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleElements((prev) =>
        prev < nodes.length + edges.length ? prev + 1 : prev
      );
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted with:", email, password);
    toast({
      title: "Login Attempted",
      description: "Your login credentials have been submitted.",
    });
    router.push("/main");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-1/2 p-8 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-blue-600"
        >
          Flow Legal
        </motion.div>
        {nodes.map((node, index) => (
          <AnimatedNode
            key={node.id}
            {...node}
            isVisible={index < visibleElements}
          />
        ))}
        {edges.map((edge, index) => (
          <AnimatedEdge
            key={`${edge.from}-${edge.to}`}
            {...edge}
            nodes={nodes}
            isVisible={
              visibleElements > nodes.length &&
              index + nodes.length < visibleElements
            }
          />
        ))}
      </div>
      <div className="w-1/2 flex items-center justify-center bg-white">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="w-[350px] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-blue-600">
                  Welcome to Flow Legal
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                    type="submit"
                  >
                    Login
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
