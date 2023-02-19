import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react"
import { StringValueNode } from "graphql/language";
import { Session } from "next-auth"
import { useState } from "react";
// import {ObjectId } from 'bson'
import ObjectId  from 'bson-objectid'
import { toast } from "react-hot-toast";
import MessageOperations from "@/src/graphql/operations/messages";
import { SendMessageVariables } from "@/src/utils/types";
interface MessageInputProps {
    session: Session | null ;
    conversationId : string
}

const MessageInput  : React.FC<MessageInputProps> = ({session, conversationId }) => {

    const [messageBody, setMessageBody] = useState('');
    const [sendMessage] = useMutation<{sendMessage: boolean}, SendMessageVariables>(MessageOperations.Mutations.sendMessage)

    const onSendMessage = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            // send message mutation
            const {user: {id: senderId}} = session;
            const messageId = ObjectId().toString();
            const newMessage: SendMessageVariables = {
                id: messageId,
                senderId, 
                conversationId,
                body: messageBody
            }

            const {data, errors} = await sendMessage({
                variables: {
                    ...newMessage
                }
            });

            if(!data?.sendMessage || errors) {
                toast.error("failed to send message");
                throw new Error("failed to send message");
            }



        } catch (error : any) {
            console.log("onSendMessage error", error);
            toast.error(error?.message)
        }
    }


    return (
        <Box py={6} width="100%"  px={4} >
            <form onSubmit={onSendMessage}>
                <Input
                value={messageBody} 
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="New Message"
                size={"md"}
                resize="none"
                _focus={{
                    boxShadow: "none",
                    border: "1px solid",
                    borderColor: "whiteAlpha.300"
                }}
                />
            </form>
        </Box>
    )
}

export default MessageInput;