import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";

interface IFeedWrapperProps {
  session: Session | null;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = (props) => {
  const router = useRouter();

  const { conversationId } = router.query;

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: 'flex' }}
      direction={"column"}
      width={"100%"}
    >
      {conversationId ? <Flex>
        {conversationId}
      </Flex> : <div>No Conversation selected</div>}
    </Flex>
  );
};

export default FeedWrapper;
