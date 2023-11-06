import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";

import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { useEffect, useRef } from "react";

import { db } from "~/utils/db.server";

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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  await db.comment.create({
    data: {
      message: formData.get("comment") as string,
      movieId: formData.get("id") as string,
    },
  });

  return redirect(`/movie/${formData.get("id")}/comments`);
}

export default function MovieId() {
  const result = useLoaderData<typeof loader>();
  const languageNames = new Intl.DisplayNames(["en"], {
    type: "language",
  });

  const { id } = useParams();
  const navigation = useNavigation();

  const isSubmitting = navigation.state == "submitting";
  const formRef = useRef<any>();
  const commentRef = useRef<any>();

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current?.reset();
      commentRef.current?.focus();
    }
  }, [isSubmitting]);

  return (
    <div className="min-h-screen p-10">
      <div className="h-[40vh] w-full rounded-lg overflow-hidden relative">
        <img
          src={`https://image.tmdb.org/t/p/original/${result.backdrop_path}`}
          alt={result.title}
          className="object-cover object-center absolute h-full w-full"
        />
      </div>
      <h1 className="text-4xl font-bold text-center pt-5">{result.title}</h1>
      <div className="flex gap-x-10 mt-10">
        <div className="w-1/2 font-medium">
          <h1 className="font-bold">
            Movie Homepage:
            <Link
              to={result.homepage}
              target="_blank"
              className="font-bold hover:text-indigo-500"
            >
              <span className="font-thin"> Check link</span>
            </Link>
          </h1>

          <h2 className="font-thin">
            <span className="font-bold">Original: </span>
            {languageNames.of(result.original_language)}
          </h2>
          <p className="font-thin">
            <span className="font-bold">Overview: </span>
            {result.overview}
          </p>
          <p className="font-thin">
            <span className="font-bold">Release Date: </span>
            {new Date(result?.release_date).toLocaleDateString("en-us", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="w-1/2">
          <div className="rounded-lg border p-3">
            <h3 className="text-xl font-semibold mb-5">Your Opinion Matters</h3>

            <div>
              <Form method="post" ref={formRef}>
                <textarea
                  ref={commentRef}
                  name="comment"
                  className="w-full border border-teal-500 rounded-lg p-2"
                ></textarea>
                <input type="hidden" name="id" value={id} />
                {isSubmitting ? (
                  <button
                    type="submit"
                    disabled
                    className="bg-teal-500 px-4 py-2 rounded-lg text-white my-4"
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-teal-500 px-4 py-2 rounded-lg text-white my-4"
                  >
                    Add comment
                  </button>
                )}
                <Outlet />
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
