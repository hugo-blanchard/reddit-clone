import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { FormEvent, useState } from "react";

import { Post, Comment } from "../../../../utils/types";
import Sidebar from "../../../../components/Sidebar";
import { useAuthState } from "../../../../context/auth";
import PostComponent from "../../../../components/postPage/PostComponent";
import CommentsComponent from "../../../../components/postPage/CommentsComponent";
import { useWindowSize } from "../../../../utils/hooks";

const PostPage = () => {
  const [newComment, setNewComment] = useState("");

  const { authenticated, user } = useAuthState();

  const { width: windowWidth } = useWindowSize();

  const router = useRouter();
  const { identifier, subName, slug } = router.query;

  const { data: post, error: errorPost, revalidate: revalidatePost } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  const { data: comments, error: errorComments, revalidate: revalidateComments } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  if (errorPost || errorComments) router.push("/");

  const vote = async (value: number, comment?: Comment) => {
    // If not logged in go to login
    if (!authenticated) router.push("/login");

    // If vote is the same reset vote
    if ((!comment && value === post.userVote) || (comment && value === comment.userVote)) value = 0;

    try {
      await axios.post("/misc/vote", {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });

      comment ? revalidateComments() : revalidatePost();
    } catch (err) {
      console.log(err);
    }
  };

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      await axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
        body: newComment,
      });
      setNewComment("");
      revalidateComments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>

      {/* Top bar */}
      <Link href={`/r/${subName}`}>
        <a>
          <div className="flex justify-center w-full h-20 mt-12 bg-green-500">
            {post && (
              <div className="container flex items-center space-x-4">
                <Image
                  src={post.sub.imageUrl ? post.sub.imageUrl : "/images/profileImage.png"}
                  width={70}
                  height={70}
                  className="rounded-full"
                />
                <p className="text-2xl font-semibold text-gray-50">r/{subName}</p>
              </div>
            )}
          </div>
        </a>
      </Link>

      {/* Content container */}
      {post && (
        <div className="container flex justify-center mx-auto mt-4">
          {/* Post and comments */}
          <div className="w-full px-2 space-y-4 md:px-0 md:w-160">
            <div className="bg-white rounded">
              <PostComponent vote={vote} post={post} />

              {/* Comment Input */}
              <div className="px-4 py-4 border-t border-gray-300 sm:px-12">
                {authenticated ? (
                  <div className="">
                    <p>
                      Comment as{" "}
                      <Link href={`/u/${user.username}`}>
                        <a className="text-green-500 hover:underline">{user.username}</a>
                      </Link>
                    </p>
                    <form onSubmit={submitComment}>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                        rows={4}
                        placeholder="What are your thoughts ?"
                      />
                      <div className="flex justify-end">
                        <button type="submit" className="px-3 py-1 button full">
                          Comment
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 sm:space-x-4 sm:flex-row">
                    <p>Log in or sign up to leave a comment :</p>
                    <Link href="/login">
                      <a className="py-1 button hollow w-28">log in</a>
                    </Link>
                    <Link href="/register">
                      <a className="py-1 button full w-28">register</a>
                    </Link>
                  </div>
                )}
              </div>

              {comments?.length > 0 && <CommentsComponent vote={vote} comments={comments} />}
            </div>
          </div>

          {/* Sidebar for large screens */}
          {windowWidth > 767 && <Sidebar sub={post.sub} />}
        </div>
      )}
    </>
  );
};

export default PostPage;
