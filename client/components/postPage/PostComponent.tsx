import classNames from "classnames";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { Post } from "../../utils/types";

interface PostComponentProps {
  post: Post;
  vote: Function;
}

const PostComponent = ({ post, vote }: PostComponentProps) => {
  return (
    <div className="flex">
      {/* Vote section */}
      <div className="w-10 py-3 text-center rounded-l">
        {/* Upvote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i
            className={classNames("icon-arrow-up", {
              "text-red-500": post.userVote === 1,
            })}
          ></i>
        </div>

        {/* Score */}
        <p className="mb-1 text-xs font-bold">{post.voteScore}</p>

        {/* Downvote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          <i
            className={classNames("icon-arrow-down", {
              "text-blue-500": post.userVote === -1,
            })}
          ></i>
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-center">
          <p className="text-xs text-gray-500">
            Posted by
            <Link href={`/u/${post.username}`}>
              <a className="mx-1 hover:underline">u/{post.username}</a>
            </Link>
            {dayjs(post.createdAt).fromNow()}
          </p>
        </div>
        {/* Post title */}
        <h1 className="my-1 text-xl font-medium">{post.title}</h1>
        {/* Post body */}
        <p className="my-3 text-sm">{post.body}</p>
        {/* Actions */}

        <div className="flex">
          <p className="p-1 text-xs text-gray-400">
            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
            <span className="font-bold">
              {post.commentCount} {post.commentCount !== 1 ? "Comments" : "Comment"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
