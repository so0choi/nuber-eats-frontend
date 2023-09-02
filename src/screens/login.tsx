import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { useMutation } from "@apollo/client";
import userEatsLogo from "../assets/images/logo.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { Helmet } from "react-helmet-async";
import { CustomLink } from "../components/link";
import { Logo } from "../components/logo";
import { gql } from "../__generated__";
import { LoginMutation } from "../__generated__/graphql";

const LOGIN_MUTATION = gql(`
  mutation Login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`);

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isLoading },
  } = useForm<ILoginForm>({
    mode: "onBlur",
  });

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authToken(token);
      isLoggedInVar(true);
    } else {
      if (error) {
        alert(error);
      }
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation(
    LOGIN_MUTATION,
    {
      variables: {
        loginInput: {
          email: watch("email"),
          password: watch("password"),
        },
      },
      onCompleted,
    }
  );

  const onSubmit = async () => {
    if (isLoading) return;
    await loginMutation();
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-32">
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <Logo size="w-52 mb-5" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome back
        </h4>
        <form
          className="grid gap-3 mt-5 w-full mb-3"
          onSubmit={handleSubmit(onSubmit)}
          id="login"
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
          <Button canClick={isValid} loading={loading} actionText="Login" />
          {loginMutationResult?.login?.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Nuber Eats?{" "}
          <CustomLink text="Create an Account" destination="/signup" />
        </div>
      </div>
    </div>
  );
};
