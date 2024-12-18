import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { handleLogin } from "../../../lib/auth";
// import { supabase } from "../../../lib/supabase";
// import crypto from "crypto";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // await handleLoginAdmin(email, password, router, setError);
    const loggedinData = await handleLogin(email, password, setError);
    // console.log("Log data: ", loggedinData);
    if (loggedinData.auth_level >= 3) {
      router.push("/236/dashboard");
    } else {
      setError("You do not have permission to access the dashboard.");
    }
  };

  return (
    <>
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - Login`}</title>
      </Head>
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white p-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-medium mb-2"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bg-blue-700"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
