export function ErrorBoundary(error: Error) {
  console.error(error);
  return (
    <div className="bg-red-400">
      <h1 className="text">Error occured while loading comments! ---</h1>
    </div>
  );
}

function CommentItem({ data }: { data: any }) {
  console.log("comment item", data);
  return (
    <div>
      {data.length > 0 ? (
        <div className="mt-5 flex flex-col gap-y-3">
          {data?.map((post: any) => (
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
