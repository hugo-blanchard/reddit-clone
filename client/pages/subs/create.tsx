import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import { slugify } from "../../utils/helpers";
import { Sub } from "../../utils/types";

const CreateSub = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<Partial<any>>({});

  const router = useRouter();

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data: sub } = await axios.post<Sub>("/subs", { name: slugify(name), title: name, description });
      router.push(`/r/${sub.name}`);
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };

  return (
    <>
      <Head>
        <title>Create a Community</title>
      </Head>
      <div className="flex w-full h-screen bg-gray-50">
        <div
          className="w-10 h-full bg-center bg-cover sm:w-40"
          style={{ backgroundImage: "url('/images/leaves.svg')" }}
        ></div>
        <div className="flex flex-col justify-center pl-6 w-96">
          <h1 className="pb-6 text-lg font-medium">Create a Community</h1>
          <form onSubmit={submitForm} className="pt-6 border-t border-gray-300">
            <div>
              <label htmlFor="name-input">
                Name
                <br />
                <span className="text-xs text-gray-500">This must represent the topic of the community.</span>
              </label>
              <br />
              <input
                type="text"
                id="name-input"
                className={classNames(
                  "w-full p-3 mt-2 border border-gray-300 rounded hover:border-gray-500 focus:border-gray-500 outline-none",
                  {
                    "border-red-600": errors.name,
                  }
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <small className="font-medium text-red-600">{errors.name}</small>
            </div>
            <div className="mt-6">
              <label htmlFor="description-input">
                Description
                <br />
                <span className="text-xs leading-3 text-gray-500">
                  This is how new members come to understand your community.
                </span>
              </label>
              <br />
              <textarea
                id="description-input"
                className={classNames(
                  "w-full p-3 mt-2 border border-gray-300 rounded hover:border-gray-500 focus:border-gray-500 outline-none",
                  {
                    "border-red-600": errors.description,
                  }
                )}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <small className="font-medium text-red-600">{errors.description}</small>
            </div>
            <div className="flex justify-end mt-4">
              <button type="submit" className="px-4 py-1 button full">
                Create Community
              </button>
            </div>
          </form>
        </div>
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

export default CreateSub;
