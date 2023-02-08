// import { Inter } from '@next/font/google'
import { signIn, signOut, useSession } from "next-auth/react";

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data, status } = useSession();

  console.log(data);
  return (
    <>
      {data?.user?.name? (
        <>
        {data?.user?.name}
        <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <>
          <button onClick={() => signIn("google")}>Sign In With Google</button>
          <button onClick={() => signIn("github")}>Sign In With Github</button>
        </>
      )}
    </>
  );
}
