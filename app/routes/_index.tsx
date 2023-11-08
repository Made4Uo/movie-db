import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  // "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
  const url = await fetch(
    "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    }
  );
  return json(await url.json());
}

export default function Index() {
  const data: any = useLoaderData();

  console.log("---------------", data);
  return (
    <div className="bg-white py-6 sm:py-8 lg-py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Top Trending Movies
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {data.results?.map((movie: any) => (
            <div
              className="flex flex-col overflow-hidden rounded-lg border bg-white"
              key={movie.id}
            >
              <Link
                prefetch="intent"
                to={`movie/${movie.id}/comments`}
                className="group relative block h-48 overflow-hidden bg-gray-100 md:h-64"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  className="absolute inset-0 h-full w-full object-cover object-center transition duration-288 group-hover:scale-110"
                />
              </Link>
              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                  <Link
                    className="transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                    to={`movie/${movie.id}/comments`}
                    prefetch="intent"
                  >
                    {movie.title}
                  </Link>
                </h2>
                <p className="text-gray-500 line-clamp-3">{movie.overview}</p>

                <span>
                  <b>Popularity: </b>
                  {movie.popularity}
                </span>
                <span>
                  <b>Vote Count: </b>
                  {movie.vote_count}
                </span>
                <span>
                  <b>Release Date: </b>
                  {movie.release_date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
