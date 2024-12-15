import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import Head from "next/head";

export default function Dashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = () => {
      const loggedInData = localStorage.getItem("loggedInData");
      let userData = null;

      if (loggedInData) {
        try {
          userData = JSON.parse(loggedInData);
        } catch (error) {
          console.error("Error parsing loggedInData:", error);
        }
      }

      console.log("Loggedin Data: ", userData);
      if (!userData) {
        router.push({
          pathname: "/236/auth/login",
          query: { error: "You do not have permission to access the page" },
        });
      } else {
        setIsAuthorized(true);
        setUser(userData);
      }
    };

    checkAuthorization();
  }, [router]);

  // useEffect(() => {
  //   const checkUser = async () => {
  //     //-- To Use Supabase's auth system in login page.
  //     //   const { data: { user } } = await supabase.auth.getUser();
  //     //-- If user is authenticated, fetch their data (Without Supabase auth system).
  //     const { data, error } = await supabase
  //       .from("players")
  //       .select("name, auth_level")
  //       .eq("auth_level", 3);
  //     // .single();  //-- Di pake klo: Use Supabase's auth system in login page.

  //     if (error || !data) {
  //       console.log("No authorized user found:", error);
  //       router.push("/236/auth/login");
  //     } else {
  //       console.log("Authorized user found:", data);
  //       setUser(data[0]);
  //     }

  //     //-- To Use Supabase's auth system in login page.
  //     //   if (user) {
  //     //     const { data, error } = await supabase
  //     //       .from("players")
  //     //       .select("name, auth_level")
  //     //       .eq("email", user.email)
  //     //       .single();

  //     //     if (error || !data || data.auth_level !== 3) {
  //     //       router.push("/236/auth/login");
  //     //     } else {
  //     //       setUser(data);
  //     //     }
  //     //   } else {
  //     //     router.push("/236/auth/login");
  //     //   }
  //   };

  //   checkUser();
  // }, []);

  const handleLogout = () => {
    //--Remove data from localStorage
    localStorage.removeItem("loggedInData");
    //--Route to the main page
    router.push("/");
  };

  // if (!user) {
  //   return (
  //     <div className="bg-black h-screen w-screen flex items-center justify-center">
  //       <p>Loading the data...</p>
  //     </div>
  //   );
  // }

  if (!isAuthorized) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p>Checking authorization and Loading data...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - Dashboard`}</title>
      </Head>
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white p-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8 text-center">Dashboard</h1>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <p className="text-xl mb-4">
              Welcome, <span className="font-bold">{user.name}</span>!
            </p>
            <p className="mb-6">You have successfully logged in.</p>
            <div className="space-y-4">
              {/* <Link href="/236/manage/teams">
                <a className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                  Manage Teams
                </a>
              </Link>
              <Link href="/236/manage/players">
                <a className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                  Manage Players
                </a>
              </Link> */}
              <Link href="/236/manage/matches">
                <a className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                  Manage Matches
                </a>
              </Link>
              <Link href="/">
                <a className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-black bg-orange-200 hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-200">
                  Homepage
                </a>
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Logout
              </button>
              {/* <Link href="/236/auth/logout">
                <a className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Logout
                </a>
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  //     <div className="max-w-md w-full space-y-8">
  //       <div>
  //         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
  //           Welcome to the Dashboard Real
  //         </h2>
  //         <p className="mt-2 text-center text-sm text-gray-600">
  //           Hello, {user.name}! You have successfully logged in.
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // );
}
