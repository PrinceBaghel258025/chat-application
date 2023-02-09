import {
  Box,
  Button,
  Center,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import * as React from "react";
import { useState } from "react";

interface IAuthProps {
  session: Session | null;
}

const Auth: React.FC<IAuthProps> = ({ session }) => {
  const [username, setUsername] = useState("");

  const submit = () => {};
  return (
    <Center height="100vh" >
      <Stack spacing={8} bg="whiteAlpha.300" padding="8" borderRadius="2xl">
        {session ? (
          <>
            <Text fontSize="3xl">Create Username</Text>
            <Input
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(event.target.value)
              }
              placeholder="Enter Username"
            />
            <Button onClick={submit} colorScheme="cyan">Save</Button>
          </>
        ) : (
          <>
            <Button colorScheme="cyan" onClick={() => signIn("google")}>Sign In with google</Button>
            <Button colorScheme="cyan" onClick={() => signIn("github")}>Sign In with github</Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
