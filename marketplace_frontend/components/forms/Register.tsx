"use client";

import { IregisterProps, registerUser } from "@/services/auth.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Earth, KeyRound, User } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

import * as yup from "yup";

function Register() {
  const initilValus: IregisterProps = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    country: null,
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("email is required")
      .test("is-email", "invalid email address", (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(value);

        return isEmail;
      }),
    firstName: yup.string().required("first Name Required"),
    lastName: yup.string().required("last name required"),
    role: yup.string().required("role is required"),
    country: yup.string().nullable().default(null),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
  });

  const handleDataSubmit = async (values: IregisterProps) => {
    await registerUser(values);
  };

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initilValus,
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldUnregister: true,
    shouldFocusError: true,
    shouldUseNativeValidation: false,
    criteriaMode: "firstError",
    delayError: 0,
  });

  return (
    <form
      onSubmit={handleSubmit(handleDataSubmit)}
      className="gap-4 flex flex-col items-center justify-center"
    >
      <label className="input validator bg-gray-100 text-gray-200">
        <User className="text-gray-800" />
        <input
          className="bg-gray-100 text-gray-800"
          type="string"
          placeholder="first name"
          {...register("firstName")}
        />
      </label>
      <div className="validator-hint hidden">Enter valid email address</div>

      <label className="input validator bg-gray-100 text-gray-80">
        <User className="text-gray-800" />
        <input
          className="bg-gray-100 text-gray-800"
          type="text"
          placeholder="last Name"
          {...register("lastName")}
        />
      </label>
      <div className="validator-hint hidden">Enter valid email address</div>

      <label className="input validator bg-gray-100 text-gray-80">
        <Earth className="text-gray-800" />
        <input
          className="bg-gray-100 text-gray-800"
          type="text"
          placeholder="Country"
          {...register("country")}
        />
      </label>
      <div className="validator-hint hidden">Enter valid email address</div>
      <label className="input validator bg-gray-100 text-gray-80">
        <KeyRound className="text-gray-800" />
        <input
          type="password"
          className="bg-gray-100 text-gray-800"
          {...register("password")}
          placeholder="Password"
          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
        />
      </label>
      <p className="validator-hint hidden">{errors.password?.message}</p>

      <div className="space-y-2">
        <div className="label">Account Type</div>
        <div className="flex items-center space-x-2">
          <input type="radio" id="buyer" name="buyer" className="radio" />
          <label htmlFor="buyer" className="label cursor-pointer">
            Buyer - I want to shop
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="radio" id="seller" name="seller" className="radio" />
          <label htmlFor="seller" className="label cursor-pointer">
            Seller - I want to sell
          </label>
        </div>
      </div>

      <button
        disabled={isSubmitting}
        className="btn btn-soft btn-primary bg-green-400 w-30"
      >
        Sign UP
      </button>
    </form>
  );
}

export default Register;
