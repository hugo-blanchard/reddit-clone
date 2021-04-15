import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

import PostCard from "../../components/PostCard";
import { useWindowSize } from "../../utils/hooks";
import { Comment, Post, User } from "../../utils/types";

const Sidebar = ({ user }) => {
  return (
    <div className="w-full md:ml-6 md:w-80">
      <div className="rounded bg-gray-50">
        <div className="p-3 bg-green-500 rounded-t">
          <img src="/images/profileImage.png" className="w-16 h-16 mx-auto overflow-hidden rounded-full" />
        </div>
        <div className="p-3 space-y-2 text-center">
          <h1 className="text-xl b-4">{user.username}</h1>
          <hr />
          <p>Joined {dayjs(user.createdAt).format("MMM YYYY")}</p>
        </div>
      </div>
    </div>
  );
};

const UserPage = () => {
  const { width: windowWidth } = useWindowSize();

  const router = useRouter();
  const { username } = router.query;

  const { data, error, revalidate } = useSWR<any>(username ? `/users/${username}` : null);
  if (error) router.push("/");

  return (
    <>
      <Head>
        <title>{data?.user.username}</title>
      </Head>
      {data && (
        <div className="container flex justify-center mx-auto mt-16">
          <div className="w-full px-2 space-y-4 md:px-0 md:w-160">
            {/* Sidebar for small screens(so not a sidebar) */}
            {windowWidth < 768 && <Sidebar user={data.user} />}

            {data.submissions.map((submission: any) => {
              if (submission.type === "Post") {
                const post: Post = submission;
                return (
                  <PostCard post={post} key={post.identifier} onSubPage={false} revalidate={revalidate} />
                );
              } else {
                const comment: Comment = submission;
                return (
                  <div key={comment.identifier} className="flex rounded bg-gray-50">
                    <div className="flex-shrink-0 w-10 py-2 text-center bg-gray-300 rounded-l">
                      <i className="mr-1 text-gray-500 fas fa-comment-alt fa-xs" />
                    </div>
                    <div className="w-full p-2 space-y-2">
                      <p className="text-xs text-gray-500">
                        <span className="font-bold text-green-500">{comment.username}</span> commented on{" "}
                        <Link
                          href={`/r/${comment.post.subName}/${comment.post.identifier}/${comment.post.slug}`}
                        >
                          <a className="text-gray-800 hover:underline">{comment.post.title} </a>
                        </Link>
                        • Posted by{" "}
                        <Link href={`/u/${comment.post.username}`}>
                          <a className="hover:underline">u/{comment.post.username}</a>
                        </Link>
                      </p>
                      <Link
                        href={`/r/${comment.post.subName}/${comment.post.identifier}/${comment.post.slug}`}
                      >
                        <a>{comment.body}</a>
                      </Link>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Sidebar for large screens */}
          {windowWidth > 767 && <Sidebar user={data.user} />}
        </div>
      )}
    </>
  );
};

export default UserPage;
