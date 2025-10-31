"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React from "react";

const Events = () => {
  const router = useRouter();

  return (
    <div className="border border-border rounded-xl p-6 bg-card hover:shadow-md transition-all duration-300 mb-6">
      {/* Event Banner */}
      <div className="h-[300px] w-full border rounded-md bg-muted flex items-center justify-center text-muted-foreground text-lg">
        🎉 Hackathon 2025 — Build. Collaborate. Win!
      </div>

      {/* Buttons */}
      <div className="flex justify-around items-center mt-5">
        {/* View Details Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hackathon 2025</DialogTitle>
              <DialogDescription>
                <p className="mt-2 text-sm text-muted-foreground">
                  Join us for a 48-hour coding marathon where innovation meets creativity!  
                  Build something incredible, meet amazing people, and win exciting prizes.  
                  <br />
                  📅 <strong>Date:</strong> Nov 5th – Nov 7th  
                  <br />
                  📍 <strong>Venue:</strong> Campus Innovation Center  
                  <br />
                  🕒 <strong>Time:</strong> 9 AM onwards  
                  <br />
                  💰 <strong>Prize Pool:</strong> ₹50,000  
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Register Button */}
        <Button onClick={() => router.push("/home/hackathon")}>Register</Button>
      </div>
    </div>
  );
};

export default Events;
