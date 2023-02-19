import { ConversationPopulated } from '@/../backend/src/utils/types';
import { Box , Text} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import ConversationItem from './ConversationItem';
import Modal from './Modal/Modal';

interface ConversationListProps {
  session: Session | null
  conversations: Array<ConversationPopulated>
  onViewConversation: (conversationId: string) => void

}

const  ConversationList : React.FC<ConversationListProps>  = ({ session, conversations, onViewConversation }) => {

    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true)
    const onClose = () => setIsOpen(false)

    const router = useRouter();
    const {id: userId} = session?.user;


  return (
    <Box>
        <Box my={4} mx={4}>
            <Text onClick={() => onOpen()} px={4} py={2} borderRadius={'full'} bg="whiteAlpha.200" align="center">Find or Create a Conversation</Text>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} session={session} />
        {conversations.map(conversation => (
          <ConversationItem userId={userId} onClick={() => onViewConversation(conversation.id)} conversation={conversation} key={conversation.id} />
        ))}
    </Box>
  )
}

export default ConversationList;