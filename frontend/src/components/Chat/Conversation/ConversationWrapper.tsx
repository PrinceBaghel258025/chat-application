import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import React from 'react'
import ConversationList from './ConversationList';

interface IConversationWrapperProps {
    session: Session | null

}

const ConversationWrapper:React.FC<IConversationWrapperProps> = ({ session }) => {

  

    
  return (
    <Box width={{ base: '100%', md: "400px"}} border="1px solid red" bg="whiteAlpha.50">
        <ConversationList session={session} />
    </Box>
  )
}
export default ConversationWrapper;