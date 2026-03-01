import React from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Login } from "@/components/auth/Login";
import { Signup } from "@/components/auth/Signup";
import ThemeToggle from "@/components/layout/ThemeToggle";

const Auth = () => {
  const [searchParams] = useSearchParams();
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg-img.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95"></div>
        {/* Additional blur overlay for glassmorphism effect */}
        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-4">
        <ThemeToggle />
        <h1 className="text-5xl font-extrabold text-foreground drop-shadow-lg">
          {searchParams.get("createNew")
            ? "Hold up! Let's login first..."
            : "Login / Signup"}
        </h1>
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="signup">
            <Signup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
