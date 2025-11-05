"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, UserIcon, Code } from "lucide-react";

const dummyProjects = [
  {
    id: 1,
    title: "AI-Powered Attendance System",
    description: "Facial recognition-based attendance app for colleges.",
    tech: ["Python", "TensorFlow", "React"],
    creator: "Riya Sharma",
    skillsNeeded: ["Frontend", "ML Engineer"],
  },
  {
    id: 2,
    title: "Campus Food Delivery Platform",
    description: "Food ordering system exclusively for college hostels.",
    tech: ["Next.js", "MongoDB", "Node.js"],
    creator: "Aman Singh",
    skillsNeeded: ["UI Designer", "Backend Dev"],
  },
  {
    id: 3,
    title: "Smart Waste Management System",
    description: "IoT-based bin level monitoring using sensors.",
    tech: ["Arduino", "React", "Firebase"],
    creator: "Neha Gupta",
    skillsNeeded: ["Hardware", "React Developer"],
  },
];

const Projects = () => {
  const [index, setIndex] = useState(0);
  const [likedProjects, setLikedProjects] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);

  const current = dummyProjects[index];

  const handleLike = () => {
    setLikedProjects([...likedProjects, current]);
    if (Math.random() > 0.5) {
      setMatches([...matches, current]); // simulate a match
    }
    setIndex((prev) => (prev + 1) % dummyProjects.length);
  };

  const handleSkip = () => {
    setIndex((prev) => (prev + 1) % dummyProjects.length);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">Discover Projects</h1>

      <div className="relative w-[400px]">
        <Card className="p-4 border border-border rounded-xl bg-card hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-lg flex justify-between">
              {current.title}
              <span className="text-sm text-muted-foreground">by {current.creator}</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{current.description}</p>

            <div className="flex flex-wrap gap-2 mb-2">
              {current.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground"
                >
                  <Code size={12} className="inline mr-1" /> {t}
                </span>
              ))}
            </div>

            <p className="text-sm">
              <strong>Skills Needed:</strong>{" "}
              {current.skillsNeeded.join(", ")}
            </p>
          </CardContent>

          <CardFooter className="flex justify-around mt-4">
            <Button variant="outline" size="icon" onClick={handleSkip}>
              <X size={20} />
            </Button>
            <Button variant="default" size="icon" onClick={handleLike}>
              <Heart className="fill-red-500 text-red-500" size={20} />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {matches.length > 0 && (
        <div className="w-full max-w-md mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Matched Projects 💡</h2>
          {matches.map((m) => (
            <div
              key={m.id}
              className="border border-border p-3 rounded-md mb-3 flex items-center justify-between bg-muted/30"
            >
              <div>
                <p className="font-medium">{m.title}</p>
                <p className="text-xs text-muted-foreground">by {m.creator}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <UserIcon size={16} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
