"use client";

import { IloginProps, loginUser } from "@/services/auth.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyRound, Mail } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

import * as yup from "yup";

function Login() {
  const initilValus: IloginProps = {
    email: "",
    password: "",
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
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
  });

  const handleDataSubmit = async (values: IloginProps) => {
    await loginUser(values);
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
      className="gap-2 flex flex-col items-center justify-center"
    >
      <label className="input validator bg-gray-100 text-gray-80">
        <Mail className="text-gray-800" />
        <input
          className="bg-gray-100 text-gray-800"
          type="email"
          placeholder="email"
          {...register("email")}
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
      <button
        disabled={isSubmitting}
        className="btn btn-soft btn-primary bg-green-400 w-30"
      >
        Sign in
      </button>
    </form>
  );
}

export default Login;
