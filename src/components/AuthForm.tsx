import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function AuthForm() {
  return (
    <form>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" />
      </div>
      <div className="mt-2 mb-4 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" />
      </div>

      <Button>Log In</Button>
    </form>
  );
}
