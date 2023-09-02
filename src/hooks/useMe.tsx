import { useQuery } from "@apollo/client";
import { gql } from "../__generated__";

const ME_QUERY = gql(`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`);

export const useMe = () => {
  return useQuery(ME_QUERY);
};
