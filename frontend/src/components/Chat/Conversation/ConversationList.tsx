import { ConversationPopulated } from '@/../backend/src/utils/types';
import { Box , Text} from '@chakra-ui/react';
import { Session } from 'next-auth';
import React, { useState } from 'react'
import Modal from './Modal/Modal';

interface ConversationListProps {
  session: Session | null
  conversations: Array<ConversationPopulated>

}

const  ConversationList : React.FC<ConversationListProps>  = ({ session, conversations }) => {

    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true)
    
    const onClose = () => setIsOpen(false)
  return (
    <Box>
        <Box my={4} mx={4}>
            <Text onClick={() => onOpen()} px={4} py={2} borderRadius={'full'} bg="whiteAlpha.200" align="center">Find or Create a Conversation</Text>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} session={session} />
    </Box>
  )
}

export default ConversationList;