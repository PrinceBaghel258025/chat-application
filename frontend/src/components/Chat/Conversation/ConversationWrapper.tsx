import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import ConversationList from "./ConversationList";
import ConversationsOperations from "@/src/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { ConversationsData } from "@/src/utils/types";
import { ConversationPopulated } from "@/../backend/src/utils/types";
import { useRouter } from "next/router";
import SkeletonLoader from "../../common/SkeletonLoader";
interface IConversationWrapperProps {
  session: Session | null;
}

const ConversationWrapper: React.FC<IConversationWrapperProps> = ({
  session,
}) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    ConversationsOperations.Queries.conversations
  );
  const router = useRouter();

  const onViewConversation = async (conversationId: string) => {
    /**
     * push the new conversation id to the router query params
     */
    router.push({ query: { conversationId } });
    /**
     * mark the conversation as read
     */
  };
  const { conversationId } = router.query;

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationsOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }
      ): {
        subscriptionData: {
          data: { conversationCreated: ConversationPopulated };
        };
      } => {
        if (!subscriptionData.data) return prev;
        console.log(subscriptionData);
        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  }, []);
  console.log("here is data", conversationsData);

  return (
    <Box
      overflow={"scroll"}
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "400px" }}
      bg="whiteAlpha.50"
      flexDirection={"column"}
      gap={4}
      sx={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {conversationsLoading ? (
        <SkeletonLoader count={7} height="80px" width="320px" />
      ) : (
        <ConversationList
          onViewConversation={onViewConversation}
          conversations={conversationsData?.conversations || []}
          session={session}
        />
      )}
    </Box>
  );
};
export default ConversationWrapper;
