"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useRouter } from "next/navigation";
import { useSignOut } from "../services/authentication";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../utils/auth";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

export default function NavBar() {
  const router = useRouter();
  const scrolled = useScroll(50);
  const { toast } = useToast();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn() ? true : false);
  }, []);

  const {
    mutate: signOut,
    isPending: isLoading,
    error,
  } = useSignOut(router, toast);

  const handleLogout = () => {
    setLoggedIn(false);
    signOut();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen flex-col items-center justify-center gap-2 bg-white">
        <p className="">Logging you out...</p>
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`fixed top-0 flex w-full justify-center ${
        scrolled
          ? "border-b border-gray-200 bg-white/5 backdrop-blur-xl"
          : "bg-white/0"
      } z-30 transition-all`}
    >
      <div className="max-w-screen-x mx-5 flex h-16 w-full items-center justify-between">
        <Link
          href="/"
          className="font-display flex items-center text-xl lg:text-2xl"
        >
          <Image
            src="/ine.png"
            alt="INE logo"
            width={100}
            height={100}
            className="mr-2 rounded-sm"
          />
        </Link>
        <div className="flex space-x-4">
          {loggedIn && (
            <div>
              <Button
                variant="ghost"
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black hover:shadow-glow"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
