import React from "react";
import { useMe } from "../../hooks/useMe";
import { Title } from "../../components/title";
import { Button } from "../../components/button";
import { useForm } from "react-hook-form";
import { gql } from "../../__generated__";
import { useApolloClient, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";

interface IFormProps {
  email?: string;
  password?: string;
}

const EDIT_PROFILE_MUTATION = gql(`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`);

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const [editProfile, { loading }] = useMutation(EDIT_PROFILE_MUTATION, {
    onCompleted: (data) => {
      const {
        editProfile: { ok },
      } = data;
      if (ok && userData) {
        const {
          me: { email: prevEmail, id },
        } = userData;
        const { email: newEmail } = getValues();
        if (newEmail && prevEmail !== newEmail) {
          client.writeFragment({
            id: `User:${id}`,
            fragment: gql(`
              fragment EditedUser on User {
                verified
                email
              }
            `),
            data: {
              email: newEmail,
              verified: false,
            },
          });
        }
      }
    },
  });

  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    defaultValues: {
      email: userData?.me.email,
    },
    mode: "onChange",
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 my-5 max-w-screen-sm w-full"
      >
        <input
          {...register("email", {
            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
          })}
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          {...register("password")}
          name={"password"}
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          canClick={formState.isValid}
          loading={loading}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};
