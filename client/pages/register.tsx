import { FormEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Axios from "axios";
import { useRouter } from "next/router";

import InputGroup from "../components/InputGroup";
import { useAuthState } from "../context/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  const { authenticated } = useAuthState();

  const router = useRouter();
  if (authenticated) router.push("/");

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await Axios.post("/auth/register", {
        email,
        password,
        username,
      });

      router.push("/login");
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="flex w-full h-screen bg-gray-50">
        <div
          className="w-10 h-full bg-center bg-cover sm:w-40"
          style={{ backgroundImage: "url('/images/leaves.svg')" }}
        ></div>
        <div className="flex flex-col justify-center p-3 w-72">
          <h1 className="mb-2 text-lg ">Sign up</h1>
          <p className="mb-10 text-xs">By continuing you agree to our User Agreement and Privacy Policy</p>
          <form className="space-y-2" onSubmit={submitForm}>
            <InputGroup
              type="email"
              value={email}
              setValue={setEmail}
              placeholder="email"
              error={errors.email}
            />
            <InputGroup
              type="text"
              value={username}
              setValue={setUsername}
              placeholder="username"
              error={errors.username}
            />
            <InputGroup
              type="password"
              value={password}
              setValue={setPassword}
              placeholder="password"
              error={errors.password}
            />
            <button
              type="submit"
              className="w-full py-2 text-xs font-bold text-white uppercase transition bg-gray-500 border border-gray-500 rounded hover:bg-gray-400"
            >
              Sign Up
            </button>
          </form>
          <small className="mt-4">
            Already have an account ?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </>
  );
};

export default Register;
