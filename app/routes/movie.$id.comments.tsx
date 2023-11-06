import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { useEffect, useRef } from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await db.comment?.findMany({
    where: {
      movieId: params.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return json({ data });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = await db.comment.create({
    data: {
      message: formData.get("comment") as string,
      movieId: formData.get("id") as string,
    },
  });
  return json({ data });
}

export default function Comment() {
  const { id } = useParams();
  const { data } = useLoaderData<typeof loader>();
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

  console.log("data", data, data.length);
  return (
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
        </Form>
        {data.length > 1 ? (
          <div className="mt-5 flex flex-col gap-y-3">
            {data?.map((post) => (
              <div key={post.id}>
                <p>{post.message}</p>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary(error: Error) {
  console.error(error);
  return (
    <div>
      <h1>Error occured while loading comments!</h1>
    </div>
  );
}
