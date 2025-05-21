import Register from "@/components/forms/Register";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="container max-w-md mx-auto py-12 px-4 bg-gray-200 text-gray-800 gap-4">
      <div className="card">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-center card-title">
            Create an account
          </div>
          <div className="text-center">
            Enter your details to create your account
          </div>
        </div>
        <div className="card-body">
          {/* reg form */}
          <Register />
        </div>
        <div className="card-actions">
          <div className="text-sm text-gray-500 text-center w-full">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-purple hover:underline font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
