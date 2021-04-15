import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { Comment } from "../../utils/types";

interface CommentsComponentProps {
  comments: Comment[];
  vote: Function;
}

const CommentsComponent = ({ comments, vote }: CommentsComponentProps) => {
  return (
    <div className="p-4 space-y-4 border-t border-gray-300">
      {comments?.map((comment: Comment) => (
        <div className="flex" key={comment.identifier}>
          <div>
            <Image src="/images/profileImage.png" width={30} height={30} className="rounded-full" />
          </div>
          <div className="pl-3">
            {/* Meta data */}
            <p className="text-xs text-gray-500">
              Posted by
              <Link href={`/u/${comment.user.username}`}>
                <a className="mx-1 hover:underline">u/{comment.user.username}</a>
              </Link>
              {dayjs(comment.createdAt).fromNow()}
            </p>

            {/* Body */}
            <p>{comment.body}</p>

            {/* Votes */}
            <p className="space-x-2">
              {/* Upvote */}
              <span
                className="w-6 mx-auto text-sm text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                onClick={() => vote(1, comment)}
              >
                <i
                  className={classNames("icon-arrow-up", {
                    "text-red-500": comment.userVote === 1,
                  })}
                ></i>
              </span>

              {/* Vote Score */}
              <span className="mb-1 text-xs font-bold">{comment.voteScore}</span>

              {/* Downvote */}
              <span
                className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                onClick={() => vote(-1, comment)}
              >
                <i
                  className={classNames("icon-arrow-down", {
                    "text-blue-500": comment.userVote === -1,
                  })}
                ></i>
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsComponent;
