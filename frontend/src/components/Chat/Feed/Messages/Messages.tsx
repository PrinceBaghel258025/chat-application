import MessageOperations from "@/src/graphql/operations/messages";
import { MessagesData, MessageSubscriptionData, MessagesVariables } from "@/src/utils/types";
import { Flex, Stack } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import SkeletonLoader from "@/src/components/common/SkeletonLoader";
import MessageItem from "./MessageItem";

interface IMessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<IMessagesProps> = ({ userId, conversationId }) => {
  const {data, loading, error, subscribeToMore} = useQuery<MessagesData, MessagesVariables>(
    MessageOperations.Queries.messages,
    {
      variables: {
        conversationId,
      },
      onError: ({message}) => {
        toast.error(message)
      },
    }
    );
    
    useEffect(() => {
      subscribeToMoreMessages(conversationId)
    }, [conversationId]);
  if(error){
    return null;
  }

  const subscribeToMoreMessages = async (conversationId: string) => {
    console.log(conversationId)
    subscribeToMore({
      document: MessageOperations.Subscriptions.sentMessage,
      variables: {
        conversationId
      },
      updateQuery: (prev, {subscriptionData} : MessageSubscriptionData) => {
        if(!subscriptionData) {
          return prev;
        }

        console.log("subscription Data", subscriptionData);
        const newMessage = subscriptionData.data.sentMessage

        return Object.assign({}, prev, {
          messages: [newMessage, ...prev.messages]
        })

      }
    })
  }

  console.log("messages data", data)

  return (
    <Flex direction={"column"} justify="flex-end" overflow={"hidden"}>
        {loading && <Stack px={4} padding={4}>
            <SkeletonLoader count={6} height="40px" width="100%" />
            </Stack>
        }
        {data?.messages && (
            <Flex direction={"column-reverse"} height="100%" overflowY="scroll">
                {data.messages.map(message =>  {
                 return  <MessageItem key={message.id} message={message} sentByMe={message.sender.id === userId} />
                }
                  // <div key={message.id}>{message.body}</div>
                )}
            </Flex>
        )}
    </Flex>
  );
};

export default Messages;
