import { Box, Button, Center } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import * as React from 'react';

interface IChatProps {
  session: Session | null;
}

const Chat: React.FC<IChatProps> = ({session}) => {
  return (
    <Center>
      <Box>
        {session?.user?.username}
        <Button onClick={() => signOut()}>SignOut</Button>
      </Box>
    </Center>
  );
};

export default Chat;
