import { useLazyQuery, useMutation } from "@apollo/client";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Center,
  Stack,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import userOperations from "@/src/graphql/operations/users";
import conversationsOperations from "@/src/graphql/operations/conversations";
import {
  createConversationData,
  createConversationVariables,
  SearchedUser,
  searchUsersData,
  searchUsersVariables,
} from "@/src/utils/types";
import UserList from "./UserList";
import Participants from "./Participants";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface IConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

const ConversationModal: React.FC<IConversationModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {

  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const router = useRouter();


  const [
    searchUsers,
    {
      data: searchUsersData,
      loading: searchUsersLoading,
      error: searchUsersError,
    },
  ] = useLazyQuery<searchUsersData, searchUsersVariables>(
    userOperations.Queries.searchUsers
  );
  const [createConversation, { data, error, loading: createConversationLoading }] = useMutation<
    createConversationData,
    createConversationVariables
  >(conversationsOperations.Mutations.createConversation);

  const {
    user: { id: userId },
  } = session;
  // console.log(userId);

  //   return function BasicUsage() {
  //     const { isOpen, onOpen, onClose } = useDisclosure();

  const addParticipants = (user: SearchedUser) => {
    setParticipants((prev) => {
      const existingUser = prev.find((u) => u === user);
      if (existingUser) {
        return prev;
      }
      return [...prev, user];
    });
    // setUsername("");
    // console.log(participants);
    // console.log(participants)
  };

  const removeParticipant = (id: String) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(username.length);
    await searchUsers({
      variables: {
        username,
      },
    });
  };

  const onCreateConversation = async () => {
    if (!participants.length) {
      return;
    }

    const participantIds = [...participants.map((p) => p.id), userId];

    try {
      const { data } = await createConversation({
        variables: {
          participantIds,
        },
      });

      // console.log("createConversation Data", data)
      if(!data?.createConversation) {
        throw new Error("Failed to create conversation")
      }

      const {createConversation: { conversationId}} = data;

      router.push({ query: { conversationId}});

      // clear state and close modal
      // on successful creation

    setParticipants([])
    setUsername("")
    onClose()

    } catch (error: any) {
      console.log("create Conversations error", error?.message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={(event) => onSearch(event)}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  onChange={(event) => setUsername(event.target.value)}
                  value={username}
                />
                <Button
                  width="100%"
                  type="submit"
                  // disabled={username.length === 0 ? "true" : "false"}
                  isDisabled={!username}
                  colorScheme={"blue"}
                  isLoading={searchUsersLoading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {searchUsersData?.searchUsers && (
              <UserList
                users={searchUsersData.searchUsers}
                addParticipant={addParticipants}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants.filter((p) => p.id !== userId)}
                  removeParticipant={removeParticipant}
                />
                {/* <Box mt={4} >
                {}
              </Box> */}
                <Button
                  bg="purple.600"
                  _hover={{ bg: "purple.600" }}
                  width="100%"
                  mt={6}
                  isLoading={createConversationLoading}
                  onClick={onCreateConversation}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
  //   };
};

export default ConversationModal;
