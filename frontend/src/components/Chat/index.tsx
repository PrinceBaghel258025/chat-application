import { Box, Button, Center, Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import * as React from 'react';
import ConversationWrapper from './Conversation/ConversationWrapper';
import FeedWrapper from './Feed/FeedWrapper';

interface IChatProps {
  session: Session | null;
}

const Chat: React.FC<IChatProps> = ({session}) => {
  return (
    <Flex height="100vh">
      
        <ConversationWrapper session={session} />
        <FeedWrapper session={session} />
        <Button colorScheme="blue" onClick={() => signOut()}>SignOut</Button>
      
    </Flex>
  );
};

export default Chat;
