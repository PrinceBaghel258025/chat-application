import { Box, Button, Center, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import * as React from "react";
import { useState } from "react";
import userOperations from "@/src/graphql/operations/users";
import { useMutation } from "@apollo/client/react";
import { createUsernameData, createUsernameVariables } from "@/src/utils/types";
import toast from 'react-hot-toast';
interface IAuthProps {
  session: Session | null;
  reloadSession: () => void
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");

  // specifies type of returnData, and the variables passed
  const [createUsername, { loading, error }] = useMutation<
    createUsernameData,
    createUsernameVariables
  >(userOperations.Mutations.createUsername);

  const submit = async () => {


    if (!username) return;
    console.log("here in submit");
    try {
      const { data } = await createUsername({
        variables: {
          username,
        }
      });
      // console.log("got data back",data)
      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;

        toast.error(error);
        return;
      }
      toast.success("usesrname created successfully");
      reloadSession(); // reloading the session to get the username
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Center height="100vh">
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
            <Button onClick={submit} colorScheme="cyan" isLoading={loading}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button colorScheme="cyan" onClick={() => signIn("google")}>
              Sign In with google
            </Button>
            <Button colorScheme="cyan" onClick={() => signIn("github")}>
              Sign In with github
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
