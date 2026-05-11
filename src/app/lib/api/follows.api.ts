import { get, post, del } from '../http/http-methods'
import { User } from '@/app/types/entities'

type MessageResponse = { message: string }
type FollowersResponse = { follower: User[] }
type FollowingResponse = { following: User[] }

export const followsApi = {
  follow: (id: string) =>
    post<MessageResponse>(`/follows/${id}`),

  unfollow: (id: string) =>
    del<MessageResponse>(`/follows/${id}`),

  getFollowers: (id: string) =>
    get<FollowersResponse>(`/follows/followers/${id}`),

  getFollowing: (id: string) =>
    get<FollowingResponse>(`/follows/following/${id}`),
}