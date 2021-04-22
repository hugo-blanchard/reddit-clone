import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Axios from "axios";
import { useEffect, useState } from "react";
import axios from "axios";

import { useAuthState, useAuthDispatch } from "../context/auth";
import { Sub } from "../utils/types";

import Logo from "../images/leaf.svg";

const Navbar: React.FC = () => {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [subs, setSubs] = useState<Sub[]>([]);
  const [timer, setTimer] = useState(null);

  const router = useRouter();

  const dispatch = useAuthDispatch();
  const { authenticated, loading } = useAuthState();

  useEffect(() => {
    if (searchBarValue.trim() === "") {
      setSubs([]);
      return;
    }

    searchSubs();
  }, [searchBarValue]);

  const logout = () => {
    Axios.get("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");

        // if on specified urls, redirect to index
        if (["/subs/create", "/r/[subName]/submit"].includes(router.pathname)) router.push("/");
      })
      .catch((err) => console.log(err));
  };

  const searchSubs = async () => {
    clearTimeout(timer);

    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await axios.get(`/subs/search/${searchBarValue}`);
          setSubs(data);
        } catch (err) {
          console.log(err);
        }
      }, 500)
    );
  };

  const goToSub = (subName: string) => {
    setSearchBarValue("");
    router.push(`/r/${subName}`);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 bg-gray-50">
      {/* Logo and title */}
      <div className="flex items-center ml-3">
        <Link href="/">
          <a>
            <h1 className="flex text-2xl font-semibold">
              <Logo className="w-8 h-8 mr-2" />
              <span className="hidden lg:block">redditclone</span>
            </h1>
          </a>
        </Link>
      </div>

      {/* Search Input */}
      <div className="max-w-full px-3 w-160">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-green-500 hover:bg-gray-50">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
          <input
            placeholder="search"
            type="text"
            className="py-1 pr-3 bg-transparent rounded outline-none"
            value={searchBarValue}
            onChange={(e) => setSearchBarValue(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          />
          {subs.length > 0 && searchFocus && (
            <div
              className="absolute left-0 right-0 border border-gray-300 rounded bg-gray-50"
              style={{ top: "110%" }}
            >
              {subs?.map((sub) => (
                <a
                  key={sub.name}
                  href={`/r/${sub.name}`}
                  className="flex items-center px-4 py-2 hover:bg-gray-200"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    goToSub(sub.name);
                  }}
                >
                  <Image
                    src={sub.imageUrl ? sub.imageUrl : "/images/profileImage.png"}
                    width={30}
                    height={30}
                    alt="Sub"
                    className="rounded-full"
                  />
                  <div className="ml-6 text-sm">
                    <p className="font-medium">{sub.title}</p>
                    <p className="text-gray-600">r/{sub.name}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Auth buttons */}
      <div className="flex mr-2 space-x-2">
        {!loading &&
          (authenticated ? (
            // Show logout
            <>
              <button className="w-20 py-2 lg:w-32 button full" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            // Show login
            <>
              <Link href="/login">
                <a className="hidden w-20 py-2 sm:block lg:w-32 button hollow">log in</a>
              </Link>
              <Link href="/register">
                <a className="hidden w-20 py-2 sm:block lg:w-32 button full">register</a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
