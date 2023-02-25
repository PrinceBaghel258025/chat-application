import { ConversationPopulated } from "@/../backend/src/utils/types";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ConversationItem from "./ConversationItem";
import Modal from "./Modal/Modal";

interface ConversationListProps {
  session: Session | null;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const { id: userId } = session?.user;

  return (
    <Box>
      <Box my={4} mx={4}>
        <Text
          onClick={() => onOpen()}
          px={4}
          py={2}
          borderRadius={"full"}
          bg="whiteAlpha.200"
          align="center"
        >
          Find or Create a Conversation
        </Text>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} session={session} />
      {conversations.map((conversation) => {
        const participant = conversation.participants.find(
          (participant) => participant.user.id === userId
        );
        return (
          <ConversationItem
            userId={userId}
            onClick={() =>
              onViewConversation(
                conversation.id,
                participant?.hasSeenLatestMessage
              )
            }
            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
            conversation={conversation}
            key={conversation.id}
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
