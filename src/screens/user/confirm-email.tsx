import React, { useEffect } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import { useQueryParam } from "../../hooks/useQueryParam";
import { useMe } from "../../hooks/useMe";
import { useHistory } from "react-router-dom";
import { gql } from "../../__generated__";
import { Helmet } from "react-helmet-async";

const VERIFY_EMAIL_MUTATION = gql(`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`);

export const ConfirmEmail = () => {
  const client = useApolloClient();
  const history = useHistory();
  const { data: userData } = useMe();
  const [verifyEmail] = useMutation(VERIFY_EMAIL_MUTATION, {
    onCompleted: (data) => {
      const {
        verifyEmail: { ok },
      } = data;
      if (!ok || !userData?.me.id) return;
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql(`
          fragment VerifiedUser on User {
            verified
          }
        `),
        data: {
          verified: true,
        },
      });
      history.push("/");
    },
  });

  const verifyCode = useQueryParam().get("code");
  useEffect(() => {
    if (!verifyCode) {
      console.error("Verify code not found");
      return;
    }
    verifyEmail({
      variables: {
        input: {
          code: verifyCode,
        },
      },
    });
  }, []);

  return (
    <div className="flex flex-col items-center mt-52">
      <Helmet>
        <title>Confirm Email | Nuber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm ">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
