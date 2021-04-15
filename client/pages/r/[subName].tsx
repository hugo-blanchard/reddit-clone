import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Axios from "axios";

import PostCard from "../../components/PostCard";
import { Sub } from "../../utils/types";
import { useAuthState } from "../../context/auth";
import Sidebar from "../../components/Sidebar";
import { useWindowSize } from "../../utils/hooks";

const SubPage = () => {
  // Local state
  const [ownsSub, setOwnsSub] = useState(false);

  // Global state
  const { authenticated, user } = useAuthState();

  // Utils
  const fileInputRef = useRef<HTMLInputElement>();

  const { width: windowWidth } = useWindowSize();

  const router = useRouter();
  const { subName } = router.query;

  const { data: sub, error, revalidate } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  useEffect(() => {
    if (!sub) return;
    setOwnsSub(authenticated && sub.username === user.username);
  }, [sub]);

  if (error) router.push("/");

  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className="text-lg text-center">Loading ...</p>;
  } else if (sub.posts.length > 0) {
    postsMarkup = (
      <>
        {/* Posts feed */}
        {sub.posts?.map((post) => (
          <PostCard onSubPage={true} key={post.identifier} post={post} revalidate={revalidate} />
        ))}
      </>
    );
  } else {
    postsMarkup = <p className="text-lg text-center">This sub seems empty</p>;
  }

  const openFileInput = (type: string) => {
    if (!ownsSub) return;

    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: { "Content-type": "multipart/form-data" },
      });

      revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <>
          <input type="file" hidden={true} ref={fileInputRef} onChange={uploadImage} />
          {/* Sub info and images */}
          <div className="mt-12">
            {/* Banner image */}
            <div
              className={classNames("bg-green-500", {
                "cursor-pointer": ownsSub,
              })}
              onClick={() => openFileInput("banner")}
            >
              {sub.bannerUrl ? (
                <div
                  className="h-40 bg-green-500"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-green-500"></div>
              )}
            </div>

            {/* Sub meta data */}
            <div className="h-20 bg-gray-50">
              <div className="container relative flex px-4 mx-auto">
                <div className="absolute" style={{ top: -20 }}>
                  <Image
                    src={sub.imageUrl ? sub.imageUrl : "/images/profileImage.png"}
                    alt="Sub"
                    className={classNames("rounded-full", {
                      "cursor-pointer": ownsSub,
                    })}
                    onClick={() => openFileInput("image")}
                    width={70}
                    height={70}
                  />
                </div>
                <div className="mt-1 ml-24">
                  <h1 className="text-3xl font-bold">{sub.title}</h1>
                  <h2 className="text-sm font-medium text-gray-400">r/{sub.name}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Posts and sidebar */}
          <div className="container flex justify-center mx-auto mt-4">
            {/* Posts */}
            <div className="w-full px-2 space-y-4 md:px-0 md:w-160">
              {/* Sidebar for small screens(so not a sidebar) */}
              {windowWidth < 768 && <Sidebar sub={sub} />}

              {postsMarkup}
            </div>

            {/* Sidebar for large screens */}
            {windowWidth > 767 && <Sidebar sub={sub} />}
          </div>
        </>
      )}
    </>
  );
};

export default SubPage;
