import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase";
import crypto from "crypto";
import Head from "next/head";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase
        .from("players")
        .select("email, passkey, auth_level")
        .eq("email", email)
        .single(); //<-- (Column and data "email" must be Unique).

      if (error) throw error;

      console.log("Input Password:", password);
      console.log("DB Password:", data.passkey);
      console.log("Data:", data);

      const hashedPassword = crypto
        .createHash("md5")
        .update(password)
        .digest("hex");

      console.log("Hashed Password:", hashedPassword);

      if (data && data.passkey === hashedPassword) {
        if (data.auth_level === 3) {
          const storedData = {
            email: data.email,
            auth_level: data.auth_level,
          };
          localStorage.setItem("loggedInData", JSON.stringify(storedData));
          console.log("Login successful, redirecting to dashboard");
          router.push("/236/dashboard");
        } else {
          console.log("Auth Level not 3:", data.auth_level);
          setError("You do not have permission to access the dashboard.");
        }
      } else {
        console.log("No user or Password mismatch");
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Invalid email or password");
      //   setError("An error occurred. Please try again.");
      console.error("Error:", error);
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
