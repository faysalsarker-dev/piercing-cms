import React from "react";
import { useForm } from "react-hook-form";

// Import shadcn components (adjust paths if needed)
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterUser() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log("User data:", data);
    alert(`Registered user: ${JSON.stringify(data, null, 2)}`);
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 my-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          Register User
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your full name"
              {...register("name", { required: "Name is required" })}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email address",
                },
              })}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="At least 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Role</Label>
            <Select defaultValue="" {...register("role", { required: "Role is required" })}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.role && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.role.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
