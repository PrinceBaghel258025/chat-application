import { ConversationPopulated } from '@/../backend/src/utils/types';
import { Stack } from '@chakra-ui/react';
import React from 'react'

interface IConversationItemProps  {
    conversation: ConversationPopulated
}

const ConversationItem : React.FC<IConversationItemProps> = ({conversation}) => {
  return (
    <Stack>{conversation.id}</Stack>
  )
}

export default ConversationItem;