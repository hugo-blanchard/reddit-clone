import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR, { useSWRInfinite } from "swr";

import { Post, Sub } from "../utils/types";
import PostCard from "../components/PostCard";
import { useAuthState } from "../context/auth";
import { useWindowSize } from "../utils/hooks";

const Sidebar = ({ topSubs, authenticated }) => {
  return (
    <>
      <div className="w-full md:ml-6 md:w-80">
        <div className="bg-gray-300 rounded ">
          <p className="py-4 ml-4 font-semibold">Top Communities</p>
          <div className="divide-y divide-gray-300 rounded-t bg-gray-50">
            {topSubs?.map((sub: Sub, index: number) => (
              <Link key={sub.name} href={`/r/${sub.name}`}>
                <a className="flex px-4 py-2">
                  <div className="flex overflow-hidden">
                    <p className="mr-4">{index + 1}</p>
                    <img
                      src={sub.imageUrl ? sub.imageUrl : "/images/profileImage.png"}
                      className="flex-shrink-0 w-8 h-8 rounded-full"
                    />
                    <p className="ml-4">r/{sub.name}</p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          {authenticated && (
            <div className="p-4 border-t-2 bg-gray-50">
              <Link href="/subs/create">
                <a className="w-full px-2 py-1 button full">Create Community</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Home = () => {
  const [observedPost, setObservedPost] = useState("");

  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

  const { data, error, isValidating, size: page, setSize: setPage, revalidate } = useSWRInfinite<Post[]>(
    (index) => `/posts?page=${index}`
  );

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? [].concat(...data) : [];

  const { authenticated } = useAuthState();

  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const id = posts[posts.length - 1].identifier;

    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );

    observer.observe(element);
  };

  return (
    <>
      <Head>
        <title>Reddit Clone</title>
      </Head>
      <div className="container flex justify-center mx-auto mt-16">
        {/* Posts feed */}
        <div className="w-full px-2 space-y-4 md:px-0 md:w-160">
          {/* Sidebar for small screens(so not a sidebar) */}
          {windowWidth < 768 && <Sidebar authenticated={authenticated} topSubs={topSubs} />}

          {isInitialLoading && <p className="text-lg text-center">Loading ...</p>}
          {posts?.map((post) => (
            <PostCard onSubPage={false} key={post.identifier} post={post} revalidate={revalidate} />
          ))}
          {isValidating && posts.length > 0 && <p className="text-lg text-center">Loading ...</p>}
        </div>

        {/* Sidebar for large screens */}
        {windowWidth > 767 && <Sidebar authenticated={authenticated} topSubs={topSubs} />}
      </div>
    </>
  );
};

export default Home;
