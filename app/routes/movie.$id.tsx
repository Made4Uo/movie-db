import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  const url = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    }
  );

  return json(await url.json());
}

export const meta: MetaFunction = ({ data }: { data: any }) => {
  return [
    { title: data.title },
    { name: "description", content: "See more about the movie and comment" },
  ];
};

export default function MovieId() {
  const data = useLoaderData<typeof loader>();
  const languageNames = new Intl.DisplayNames(["en"], {
    type: "language",
  });

  return (
    <div className="min-h-screen p-10">
      <div className="h-[40vh] w-full rounded-lg overflow-hidden relative">
        <img
          src={`https://image.tmdb.org/t/p/original/${data.backdrop_path}`}
          alt={data.title}
          className="object-cover object-center absolute h-full w-full"
        />
      </div>
      <h1 className="text-4xl font-bold text-center pt-5">{data.title}</h1>
      <div className="flex gap-x-10 mt-10">
        <div className="w-1/2 font-medium">
          <h1 className="font-bold">
            Movie Homepage:
            <Link
              to={data.homepage}
              target="_blank"
              className="font-bold hover:text-indigo-500"
            >
              <span className="font-thin"> Check link</span>
            </Link>
          </h1>

          <h2 className="font-thin">
            <span className="font-bold">Original: </span>
            {languageNames.of(data.original_language)}
          </h2>
          <p className="font-thin">
            <span className="font-bold">Overview: </span>
            {data.overview}
          </p>
          <p className="font-thin">
            <span className="font-bold">Release Date: </span>
            {new Date(data?.release_date).toLocaleDateString("en-us", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="w-1/2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
