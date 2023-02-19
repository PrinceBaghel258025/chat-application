import { MessagePopulated } from "@/../backend/src/utils/types";
import { messageFields } from "@/src/graphql/operations/messages";
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface IMessageItemProps {
  message: MessagePopulated;
  sentByMe: boolean;
}

const MessageItem: React.FC<IMessageItemProps> = ({ message, sentByMe }) => {
  return (
    <Stack
      direction="row"
      p={4}
      spacing={4}
      _hover={{ bg: "whiteAlpha.200" }}
      justify={sentByMe ? "flex-end" : "flex-start"}
      wordBreak="break-word"
    >
      {!sentByMe && (
        <Flex align="flex-end">
          <Avatar size="sm" />
        </Flex>
      )}
      <Stack spacing={1} width="100%">
        <Stack
          direction="row"
          align="center"
          justify={sentByMe ? "flex-end" : "flex-start"}
        >
          {!sentByMe && (
            <Text fontWeight={500} textAlign={sentByMe ? "right" : "left"}>
              {message.sender.username}
            </Text>
          )}
          <Text fontSize={14} color="whiteAlpha.700">
            {/* {formatRelative(message.createdAt, new Date(), {
              locale: {
                ...enUS,
                formatRelative: (token) =>
                  formatRelativeLocale[
                    token as keyof typeof formatRelativeLocale
                  ],
              },
            })} */}
            {message.createdAt}
          </Text>
        </Stack>
        <Flex direction="row" justify={sentByMe ? "flex-end" : "flex-start"}>
          <Box
            bg={sentByMe ? "brand.100" : "blackAlpha.50"}
            px={2}
            py={1}
            borderRadius={12}
            maxWidth="65%"
          >
            <Text>{message.body}</Text>
          </Box>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default MessageItem;
