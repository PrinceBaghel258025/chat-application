// import { Inter } from '@next/font/google'
import { NextPage } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { Button, Stack, Container, Box } from "@chakra-ui/react";
import { NextPageContext, ST } from "next/dist/shared/lib/utils";
import Chat from "../components/Chat";
import Auth from "../components/Auth";

// const inter = Inter({ subsets: ['latin'] })

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }

  return (
    <Box>
      {session && session?.user?.username ? (
        <Chat session={session} />
      ) : (
        <Auth session={session} reloadSession={reloadSession} />
      )}
    </Box>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Home;
