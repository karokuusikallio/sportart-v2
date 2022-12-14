import type { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import Head from "next/head";

import HeroSection from "../components/HeroSection";
import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";

import getSessionInfo from "../components/helpers/getSessionInfo";

const Home: NextPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      const session = await getSessionInfo();

      if (session && session.user) {
        if (session?.user?.inDatabase === true) {
          setUserId(session.user.id);
          setLoading(false);
          return;
        }
        signOut();
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <>
        <Head>
          <title>Cover Arts</title>
        </Head>
        <main className="flex-1 overflow-y-scroll">
          <p className="p-20">Loading...</p>
        </main>
      </>
    );
  }

  if (userId) {
    return (
      <>
        <Head>
          <title>Dashboard | Cover Arts</title>
        </Head>
        <main className="flex-1 overflow-y-scroll">
          <HeroSection backgroundName="record-store">
            <h1 className="opacity-100">Dashboard</h1>
          </HeroSection>
          <Dashboard />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Cover Arts</title>
      </Head>
      <main className="flex-1 overflow-y-scroll bg-record-store bg-cover bg-center bg-no-repeat">
        <HeroSection backgroundName="none">
          <h1 className="bg-white p-2 opacity-100">Cover Arts App</h1>
        </HeroSection>
        <div className="p-5 sm:p-20">
          <p className="my-5 inline w-2/3 bg-white text-xl font-semibold text-spotartPurple">
            Cover Arts is an app where you can search and discover new music
            based on album cover art. You can also create collections from your
            favorite covers. You only need a Spotify account.
          </p>
          <br />
          <br />
          <button
            className="text-bold h-8 rounded-lg bg-spotartPurple px-2 uppercase text-white hover:bg-spotartLightPurple"
            onClick={() => signIn("spotify")}
            id="signInButton"
          >
            Sign in with Spotify
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
