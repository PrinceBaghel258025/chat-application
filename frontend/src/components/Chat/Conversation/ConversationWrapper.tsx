import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import ConversationList from "./ConversationList";
import ConversationsOperations from "@/src/graphql/operations/conversations";
import { useQuery } from "@apollo/client";
import { ConversationsData } from "@/src/utils/types";
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
  } = useQuery<ConversationsData, null>(ConversationsOperations.Queries.conversations);

  console.log("here is data", conversationsData)

  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      border="1px solid red"
      bg="whiteAlpha.50"
    >
      <ConversationList conversations={conversationsData?.conversations || []} session={session} />
    </Box>
  );
};
export default ConversationWrapper;
