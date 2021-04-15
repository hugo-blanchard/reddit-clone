import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import classNames from "classnames";

dayjs.extend(relativeTime);

import { Post } from "../utils/types";
import Image from "next/image";
import { useAuthState } from "../context/auth";
import { useRouter } from "next/router";

interface PostCardProps {
  post: Post;
  onSubPage: boolean;
  revalidate: Function;
}

const PostCard = ({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  },
  onSubPage,
  revalidate,
}: PostCardProps) => {
  const { authenticated } = useAuthState();

  const router = useRouter();

  const vote = async (value: number) => {
    if (!authenticated) router.push("/login");

    if (value === userVote) value = 0;

    try {
      await axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });

      revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div key={identifier} id={identifier} className="flex rounded bg-gray-50">
      {/* Vote section */}
      <div className="w-10 py-2 text-center bg-gray-300 rounded-l">
        {/* Upvote */}
        <div
          onClick={() => {
            vote(1);
          }}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
        >
          <i
            className={classNames("icon-arrow-up", {
              "text-red-500": userVote === 1,
            })}
          ></i>
        </div>

        {/* Score */}
        <p className="mb-1 text-xs font-bold">{voteScore}</p>

        {/* Downvote */}
        <div
          onClick={() => {
            vote(-1);
          }}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
        >
          <i
            className={classNames("icon-arrow-down", {
              "text-blue-500": userVote === -1,
            })}
          ></i>
        </div>
      </div>

      {/* Post data section */}
      <div className="w-full p-2">
        <div className="flex items-center space-x-1">
          {!onSubPage && (
            <Link href={`/r/${subName}`}>
              <a className="flex items-center text-xs font-bold hover:underline">
                <Image
                  src={sub.imageUrl ? sub.imageUrl : "/images/profileImage.png"}
                  width={25}
                  height={25}
                  className="rounded-full"
                />
                <span className="ml-1">r/{subName}</span>
              </a>
            </Link>
          )}
          <p className="text-xs text-gray-600 ">
            {!onSubPage && <span className="hidden sm:inline">{"• "}</span>}Posted by
            <Link href={`/u/${username}`}>
              <a className="mx-1 hover:underline">u/{username}</a>
            </Link>
            <Link href={url}>
              <a className="hidden hover:underline sm:inline">{dayjs(createdAt).fromNow()}</a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a>
            <h2 className="my-1 text-lg font-medium">{title}</h2>
            {body && <p className="my-1 overflow-hidden text-sm max-h-20">{body}</p>}
          </a>
        </Link>
        <div className="flex">
          <Link href={url}>
            <a>
              <div className="p-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">
                  {commentCount} {commentCount !== 1 ? "Comments" : "Comment"}
                </span>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
