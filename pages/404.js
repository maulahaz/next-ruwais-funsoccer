import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <Head>
        <title>Page Under Construction | Ruwais Gibol</title>
      </Head>
      <div className="text-center">
        <p className="text-xl text-gray-300 mb-8">Oops! Sorry</p>
        <p className="text-gray-400 mb-8">
          The page you are looking for is temporarily unavailable.
        </p>
        <Link href="/">
            <button className="text-sm px-6 py-3 border rounded-full hover:bg-orange-200 hover:text-black transition duration-300">
              Back to Home
            </button>
          </Link>
      </div>
    </div>
  );
}