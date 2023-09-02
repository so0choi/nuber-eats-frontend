import React, { useState } from "react";
import { gql } from "../../__generated__";
import { useQuery } from "@apollo/client";
import {
  RestaurantsPageQueryQuery,
  RestaurantsPageQueryQueryVariables,
} from "../../__generated__/graphql";
import { Restaurant } from "../../components/restaurant";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

const RESTAURANTS_QUERY = gql(`
    query restaurantsPageQuery($input: RestaurantsInput!) {
        allCategories {
            ok
            error
            categories {
                id
                name
                coverImage
                slug
                restaurantCount
            }
        }
        restaurants(input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
                id
                name
                coverImage
                category{
                  name
                }
                address
                isPromoted
            }
        }
    }
`);

interface IFilterProps {
  name: string;
  isSelected: boolean;
}

const Filter: React.FC<IFilterProps> = ({ name, isSelected }) => {
  return (
    <div
      className={`${isSelected ? "bg-gray-700" : "bg-gray-300"} ${
        isSelected ? "text-white" : "text-black"
      } px-4 py-2 rounded-3xl cursor-pointer`}
    >
      <span>{name}</span>
    </div>
  );
};

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    RestaurantsPageQueryQuery,
    RestaurantsPageQueryQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPreviousPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <form
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
        onSubmit={handleSubmit(onSearchSubmit)}
      >
        <input
          {...register("searchTerm", { required: true, min: 3 })}
          className="input w-1/4 rounded-md border-0 md:w-3/12 w-3/4"
          type="Search"
          placeholder="Search restaurants"
        />
      </form>
      <div className={`p-10`}>
        {!loading && (
          <div className={`container mt-8`}>
            <div className={`flex justify-around max-w-xs mx-auto `}>
              {data?.allCategories.categories?.map((category) => (
                <div
                  key={category.id}
                  className={`flex flex-col items-center cursor-pointer group`}
                >
                  <div
                    className={`w-16 h-16 bg-cover rounded-full group-hover:bg-gray-100`}
                    style={{ backgroundImage: `url(${category.coverImage}` }}
                  ></div>
                  <span className={`mt-3 text-center text-sm font-medium`}>
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div className={`flex gap-4 mt-16`}>
                <Filter name={`🚴 Pickup`} isSelected={true} />
                <Filter name={`Sort ↓`} isSelected={false} />
                <Filter name={`Price range ↓`} isSelected={false} />
                <Filter name={`Max Delivery Fee ↓`} isSelected={false} />
                <Filter name={`Dietary ↓`} isSelected={false} />
              </div>
              <div
                className={`grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10 pb-20`}
              >
                {data?.restaurants.results?.map((restaurant) => (
                  <Restaurant
                    key={restaurant.id}
                    id={restaurant.id + ""}
                    coverImage={restaurant.coverImage}
                    name={restaurant.name}
                    categoryName={restaurant.category?.name}
                  />
                ))}
              </div>
              <div
                className={`grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10`}
              >
                {page > 1 ? (
                  <button
                    onClick={onPreviousPageClick}
                    className={`focus:outline-none font-medium text-2xl`}
                  >
                    &larr;
                  </button>
                ) : (
                  <div></div>
                )}
                <span>
                  Page {page} of {data?.restaurants.totalPages}
                </span>
                {page !== data?.restaurants.totalPages && (
                  <button
                    onClick={onNextPageClick}
                    className={`focus:outline-none font-medium text-2xl`}
                  >
                    &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
