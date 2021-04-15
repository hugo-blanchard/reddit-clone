import { AppProps } from "next/app";
import Axios from "axios";
import { useRouter } from "next/router";
import { SWRConfig } from "swr";

import { AuthProvider } from "../context/auth";

import "../styles/globals.css";
import "../styles/icons.css";

import Navbar from "../components/Navbar";
import Head from "next/head";

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api/";
Axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  try {
    const res = await Axios.get(url);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { pathname } = useRouter();
  const noNavRoutes = ["/register", "/login"];
  const isOnNoNavRoute = noNavRoutes.includes(pathname);

  return (
    <>
      <Head>
        <title>Reddit Clone</title>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
          crossOrigin="anonymous"
        />
      </Head>
      <SWRConfig
        value={{
          fetcher,
          dedupingInterval: 60000, // one minute interval
        }}
      >
        <AuthProvider>
          {!isOnNoNavRoute && <Navbar />}
          <Component {...pageProps} />
        </AuthProvider>
      </SWRConfig>
    </>
  );
};

export default MyApp;
