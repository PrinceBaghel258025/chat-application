import { Session } from 'next-auth';
import React from 'react'

interface IFeedWrapperProps  {
    session: Session | null
}

const FeedWrapper: React.FC<IFeedWrapperProps> = (props) => {
  return (
    <div>FeedWrapper</div>
  )
}

export default FeedWrapper;