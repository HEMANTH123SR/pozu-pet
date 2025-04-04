import { currentUser, User } from '@clerk/nextjs/server'
import RealTimeChat from '@/components/rtmComp/chat'

export default async function Chat() {
  const user = (await currentUser()) as User

  if (!user) {
    return null
  }

  const userData = {
    id: user.id,
    ...(user.fullName ? { name: user.fullName } : {}),
    ...(user.imageUrl ? { image: user.imageUrl } : {})
  }

  return <RealTimeChat userData={userData} />
}
