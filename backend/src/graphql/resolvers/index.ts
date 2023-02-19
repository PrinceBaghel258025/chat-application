import userResolvers from "./user";
import conversationResolvers from './conversation'
import messageResolvers from './messages'
import merge from 'lodash.merge';
import scalarResolvers from './scalars'
const resolvers = merge({}, userResolvers, conversationResolvers, messageResolvers, scalarResolvers);


export default resolvers;