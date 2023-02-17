import { SearchedUser } from "@/src/utils/types";
import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface IUserListProps {
  users: Array<SearchedUser>
  addParticipant: (user : SearchedUser) => void
}

const UserList: React.FC<IUserListProps> = ({ users, addParticipant }) => {

    console.log(users.length)
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify="center">
          <Text>No Users Found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user) => (
            <Stack
              mb={6}
              width={"100%"}
              direction="row"
              align={"center"}
              key={user.id}
            >
              <Avatar />
              <Flex justify={"space-between"} width="100%">
                <Text>{user.username}</Text>
                <Button onClick={() => addParticipant(user)} colorScheme={"blue"} _hover={{bg: "blue"}}>Select</Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};

export default UserList;
