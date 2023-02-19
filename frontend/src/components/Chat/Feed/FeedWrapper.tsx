import { Flex, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import Header from "./Messages/Header";
import MessageInput from "./Messages/Input";
import Messages from "./Messages/Messages";

interface IFeedWrapperProps {
  session: Session | null;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ session }) => {
  const router = useRouter();

  const { user:{id:userId}} = session;

  const { conversationId } = router.query;

  return (
    <>
      <Flex
        display={{ base: conversationId ? "flex" : "none", md: "flex" }}
        direction={"column"}
        width={"100%"}
      >
        {conversationId && typeof conversationId === "string" ? (
          <>
            <Flex
              flexDirection={"column"}
              flexGrow={1}
              overflow={"hidden"}
              justify="space-between"
            >
              {/* {conversationId}
               */}
              <Header userId={userId} conversationId={conversationId} />
              <Messages userId={userId} conversationId={conversationId} />
            </Flex>
            <MessageInput session={session} conversationId={conversationId} />
          </>
        ) : (
          <div>No Conversation selected</div>
        )}
      </Flex>
    </>
  );
};

export default FeedWrapper;
