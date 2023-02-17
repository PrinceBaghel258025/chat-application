import { SearchedUser } from "@/src/utils/types";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import React from "react";

interface IParticipantsProps {
  participants: Array<SearchedUser>;
  removeParticipant: (id: String) => void;
}

const Participants: React.FC<IParticipantsProps> = ({
  participants,
  removeParticipant,
}) => {
  return (
    <Flex mt={8} mb={4} flexWrap="wrap" gap={"10px"}>
      {participants.map((participant) => (
        <Stack
          key={participant.id}
          direction={"row"}
          align={"center"}
          bg="whiteAlpha.200"
          borderRadius={4}
          p={2}
        >
          <Text>{participant.username}</Text>
          <IoIosCloseCircleOutline
            size={20}
            cursor="pointer"
            onClick={() => removeParticipant(participant.id)}
          />
        </Stack>
      ))}
    </Flex>
  );
};

export default Participants;
