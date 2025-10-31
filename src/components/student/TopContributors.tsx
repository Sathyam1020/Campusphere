import React from "react";
import { Trophy, UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const contributors = [
  {
    id: 1,
    name: "Arjun Patel",
    college: "IIT Bombay",
    posts: 42,
    badge: "🥇",
  },
  {
    id: 2,
    name: "Kritika Singh",
    college: "Delhi University",
    posts: 36,
    badge: "🥈",
  },
  {
    id: 3,
    name: "Rahul Verma",
    college: "BMS College of Engineering",
    posts: 29,
    badge: "🥉",
  },
  {
    id: 4,
    name: "Neha Gupta",
    college: "PES University",
    posts: 22,
  },
  {
    id: 5,
    name: "Aman Sharma",
    college: "Christ University",
    posts: 19,
  },
];

const TopContributors = () => {
  return (
    <Card className="border border-border rounded-xl p-4 bg-card hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" size={22} /> Top Contributors
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {contributors.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between border-b pb-3 last:border-none"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <UserIcon className="text-muted-foreground" size={20} />
                </div>
                <div>
                  <p className="font-semibold">
                    {user.name} {user.badge && <span>{user.badge}</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.college}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {user.posts} posts
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopContributors;
