import ConversationOperations from '@/src/graphql/operations/conversations'
import { ConversationsData } from '@/src/utils/types'
import { Button, Skeleton, Stack, Text } from '@chakra-ui/react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import React from 'react'
import { formatUsernames } from '@/src/utils/functions'

interface IHeaderProps  {
    userId: string
    conversationId: string
}

const Header : React.FC<IHeaderProps> = ({
    conversationId, userId
}) => {

    const router = useRouter();
    const {data, loading} = useQuery<ConversationsData, null>(ConversationOperations.Queries.conversations)

    const conversation = data?.conversations.find(conversation => conversation.id === conversationId)
    if(data?.conversations && !loading && !conversation) {
        router.replace(process.env.NEXT_PUBLIC_BASE_URL as string)
    }

  return (
    <Stack
    direction={"row"}
    align="center"
    spacing={6}
    py={5} 
    px={{ base: 4, md: 0}}
    borderRadius={"1px solid"}
    borderColor={"whiteAlpha.200"}
    >
        <Button
            display={{ md: "none"}}
            onClick={() => router.replace("?conversationId", "/", {
                shallow: true
            })}
        >Back</Button>
        {/* {loading && <Skeleton count={1} />} */}
        {
            conversation && (
                <Stack direction={"row"} >
                    <Text color={"whiteAlpha.600"}>To: </Text>
                    <Text fontWeight={600}>
                        {formatUsernames(conversation.participants, userId)}
                    </Text>
                </Stack>
            )
        }

    </Stack>
  )
}

export default Header