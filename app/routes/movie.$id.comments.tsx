import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await db.comment.findMany({
    where: {
      movieId: params.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return json({ data });
}

function CommentItem() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <div>
      {data ? (
        <div className="mt-5 flex flex-col gap-y-3">
          {data.map((post: any) => (
            <div key={post.id}>
              <p>{post.message}</p>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default CommentItem;

export function ErrorBoundary(error: Error) {
  console.error(error);
  return (
    <div className="bg-red-200 rounded-lg p-4">
      <h1 className="text">Error occured while loading comments!</h1>
    </div>
  );
}
