import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { useMutation } from "@apollo/client";
import userEatsLogo from "../assets/images/logo.svg";
import { Button } from "../components/button";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CustomLink } from "../components/link";
import { Logo } from "../components/logo";
import { gql } from "../__generated__";
import { CreateAccountMutation, UserRole } from "../__generated__/graphql";

const CREATE_ACCOUNT_MUTATION = gql(`
  mutation CreateAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`);

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ICreateAccountForm>({
    mode: "onBlur",
    defaultValues: {
      role: UserRole.Client,
    },
  });

  const history = useHistory();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (ok) {
      alert("Account created! Please log in");
      history.push("/");
    } else {
      if (error) {
        alert(error);
      }
    }
  };

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation(CREATE_ACCOUNT_MUTATION, {
    variables: {
      createAccountInput: {
        email: watch("email"),
        password: watch("password"),
        role: watch("role"),
      },
    },
    onCompleted,
  });

  const onSubmit = async () => {
    if (loading) return;
    await createAccountMutation();
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-32">
      <Helmet>
        <title>Sign Up | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <Logo size="w-52 mb-5" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Let's get started
        </h4>
        <form
          className="grid gap-3 mt-5 w-full mb-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("email", {
              required: "Email is required",
              pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
            })}
            type="email"
            placeholder="Email"
            className="input"
            required
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage="Please enter a valid email" />
          )}
          <input
            {...register("password", {
              required: "Password is required",
            })}
            type="password"
            placeholder="Password"
            className="input"
            required
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <select className="input" {...register("role", { required: true })}>
            {Object.keys(UserRole).map((role, idx) => (
              <option key={idx}>{role}</option>
            ))}
          </select>
          <Button
            canClick={isValid}
            loading={false}
            actionText="Create an account"
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?{" "}
          <CustomLink text="Log in now" destination="/" />
        </div>
      </div>
    </div>
  );
};
