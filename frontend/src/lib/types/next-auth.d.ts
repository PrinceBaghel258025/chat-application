import 'next-auth';

declare module "next-auth" {
    interface Session {
        user: User
    }
    interface User {
        username: string
        id: string
    }
}