import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import ConversationList from "./ConversationList";
import ConversationsOperations from "@/src/graphql/operations/conversations";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { ConversationsData, ConversationUpdatedData } from "@/src/utils/types";
import { ConversationPopulated, ParticipantPopulated } from "@/src/graphql/operations/conversations";
import { useRouter } from "next/router";
import SkeletonLoader from "../../common/SkeletonLoader";
interface IConversationWrapperProps {
  session: Session | null;
}

const ConversationWrapper: React.FC<IConversationWrapperProps> = ({
  session,
}) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const {user: {id  : userId } } = session; 

  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    ConversationsOperations.Queries.conversations
  );

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(ConversationsOperations.Mutations.markConversationAsRead);

  useSubscription<ConversationUpdatedData, null>(ConversationsOperations.Subscriptions.conversationUpdated,
    {
      onData: ({client, data}) => {
        const {data: subscriptionData} = data;
        console.log("onDataFiring", subscriptionData)
        if(!subscriptionData) {
          return ;
        }

        const {conversationUpdated: {conversation: updatedConversation} } =  subscriptionData;

        const currentlyViewingConversation = updatedConversation.id === conversationId
        if(currentlyViewingConversation) {
          onViewConversation(conversationId, false)
        }

      }
    })




  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => {
    router.push({ query: { conversationId } });

    /**
     * Only mark as read if conversation is unread
     */
    if (hasSeenLatestMessage) return;

    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          /**
           * Get conversation participants
           * from cache
           */
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          /**
           * Create copy to
           * allow mutation
           */
          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          /**
           * Should always be found
           * but just in case
           */
          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          /**
           * Update user to show latest
           * message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipants on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error) {
      console.log("onViewConversation error", error);
    }
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationsOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }
      ): {
        subscriptionData: {
          data: { conversationCreated: ConversationPopulated };
        };
      } => {
        if (!subscriptionData.data) return prev;
        console.log(subscriptionData);
        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  }, []);
  console.log("here is data", conversationsData);

  return (
    <Box
      overflow={"scroll"}
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "400px" }}
      bg="whiteAlpha.50"
      flexDirection={"column"}
      gap={4}
      sx={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {conversationsLoading ? (
        <SkeletonLoader count={7} height="80px" width="320px" />
      ) : (
        <ConversationList
          onViewConversation={onViewConversation}
          conversations={conversationsData?.conversations || []}
          session={session}
        />
      )}
    </Box>
  );
};
export default ConversationWrapper;
