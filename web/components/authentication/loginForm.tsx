"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader, Loader2, AlertCircle } from "lucide-react";
import { useSignin } from "../services/authentication";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

const LogInForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [showLoader, setShowLoader] = useState(false);

  const router = useRouter();
  const {
    mutate: signIn,
    isPending: isLoading,
    error,
  } = useSignin(router, toast);

  // Validation functions
  const validateUsername = (username: string) => {
    return username.length >= 3; // Ensure at least 7 characters
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {
      username: "",
      password: "",
    };

    if (!formData.username) {
      newErrors.username = "Username is required.";
      formIsValid = false;
    } else if (!validateUsername(formData.username)) {
      newErrors.username = "Username must be at least 3 characters long.";
      formIsValid = false;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_])[A-Za-z\d!@#$%&*_]{3,20}$/;
    if (!formData.password) {
      newErrors.password = "Password is required.";
      formIsValid = false;
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character from !@#$%&*_.";
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      setShowLoader(true);
      signIn(formData);
      setShowLoader(isLoading);
    }
  };

  if (showLoader) {
    return (
      <div className="fixed inset-0 z-[1000] flex h-screen w-full items-center justify-center bg-white bg-opacity-35 text-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={50} className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="username">Username:</Label>
          <Input
            id="username"
            placeholder="Username"
            type="text"
            autoCapitalize="none"
            autoComplete="username"
            className="text-black"
            autoCorrect="off"
            value={formData.username}
            onChange={handleChange}
          />
          {/* {errors.username && <div className="text-red-500">{errors.username}</div>} */}
          {/* {errors.username && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold border border-red-700 p-3 rounded-lg shadow-md">
                {errors.username}
            </div>
            )} */}
          {errors.username && (
            <div className="mt-1 flex items-start rounded-md bg-red-100 p-2 text-sm text-red-600">
              <AlertCircle className="my-auto mr-2 h-5 w-5 flex-shrink-0" />
              <span className="leading-relaxed">{errors.username}</span>
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password:</Label>
          <Input
            id="password"
            placeholder="Password"
            type="password"
            autoCapitalize="none"
            autoComplete="password"
            className="text-black"
            autoCorrect="off"
            value={formData.password}
            onChange={handleChange}
          />
          {/* {errors.password && <div className="text-red-500">{errors.password}</div>} */}
          {errors.password && (
            // <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold border border-red-700 p-3 rounded-lg shadow-md">
            //     {errors.password}
            // </div>
            // )}
            //     <div className="flex items-center mt-1 text-sm text-red-600 bg-red-100 p-2 rounded-md">
            //     <AlertCircle className="w-4 h-4 mr-1" />
            //     {/* <div className="flex items-center mt-1 text-sm text-red-600 bg-red-100 p-2 rounded-md"> */}
            //     <div>
            //     {errors.password}
            //     </div>
            //   </div>

            <div className="mt-1 flex items-start rounded-md bg-red-100 p-2 text-sm text-red-600">
              <AlertCircle className="my-auto mr-2 h-5 w-5 flex-shrink-0" />
              <span className="leading-relaxed">{errors.password}</span>
            </div>
          )}
        </div>
        <Button
          variant="default"
          //   className="border-0 rounded-xl"
          className="rounded-xl border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:border-white hover:bg-white hover:text-black hover:shadow-glow"
          disabled={showLoader || isLoading}
        >
          {isLoading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Log In"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LogInForm;
