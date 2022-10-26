import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  console.log(session?.user);

  if (session && status === "authenticated") {
    return (
      <main>
        <h1>SpotArt App</h1>
        <p>Welcome {session.user?.name}</p>
        <button type="submit" onClick={() => signOut()}>
          Logout
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>SpotArt App</h1>
      <button type="submit" onClick={() => signIn("spotify")}>
        Sign in with Spotify
      </button>
    </main>
  );
};

export default Home;
