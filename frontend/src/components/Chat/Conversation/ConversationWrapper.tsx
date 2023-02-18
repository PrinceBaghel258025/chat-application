import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import ConversationList from "./ConversationList";
import ConversationsOperations from "@/src/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { ConversationsData } from "@/src/utils/types";
import { ConversationPopulated } from "@/../backend/src/utils/types";
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
        console.log(subscriptionData)
        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {conversations: [newConversation, ...prev.conversations]});
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations()
  }, []);
  console.log("here is data", conversationsData);

  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      border="1px solid red"
      bg="whiteAlpha.50"
    >
      <ConversationList
        conversations={conversationsData?.conversations || []}
        session={session}
      />
    </Box>
  );
};
export default ConversationWrapper;
