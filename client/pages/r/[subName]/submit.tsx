import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import classNames from "classnames";
import axios from "axios";
import { GetServerSideProps } from "next";

import Sidebar from "../../../components/Sidebar";
import { Post, Sub } from "../../../utils/types";
import { useWindowSize } from "../../../utils/hooks";

const Submit = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { width: windowWidth } = useWindowSize();

  const router = useRouter();
  const { subName } = router.query;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);
  if (error) router.push("/");

  const submitPost = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim() === "") return;

    try {
      const { data: post } = await axios.post<Post>("/posts", { title: title.trim(), body, sub: subName });

      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(router.pathname);
  return (
    <>
      <Head>
        <title>Submit to Redditclone</title>
      </Head>
      <div className="container flex justify-center mx-auto mt-16">
        {sub && (
          <>
            <div className="w-full px-2 md:px-0 md:w-160">
              <div className="p-4 rounded bg-gray-50">
                <h1 className="mb-3 text-lg">Submit a post to r/{subName}</h1>
                <form onSubmit={submitPost}>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                      placeholder="Title"
                      maxLength={100}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <div
                      className={classNames("text-sm text-gray-500 select-none absolute", {
                        "text-red-500": title.trim().length > 99,
                      })}
                      style={{ top: 11, right: 10 }}
                    >
                      {title.trim().length}/100
                    </div>
                  </div>
                  <textarea
                    className="w-full p-3 mt-6 border border-gray-300 rounded focus:border-gray-600 focus:outline-none"
                    placeholder="Text (optional)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <button type="submit" className="px-3 py-2 button full">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {windowWidth > 767 && <Sidebar sub={sub} noSubmit={true} />}
          </>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("Missing auth token cookie");

    await axios.get("/auth/me", { headers: { cookie } });

    return { props: {} };
  } catch (err) {
    res.writeHead(307, { Location: "/login" }).end();
  }
};

export default Submit;
