'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/store/auth.store'
import { useModal } from '@/app/context/ModalContext'
import { usersApi, followsApi } from '@/app/lib/api'
import { User } from '@/app/types/entities'

export type UserProfileTab = 'followers' | 'following'

export function useUserProfile(id: string | undefined) {
  const router = useRouter()
  const { isAuthenticated, user: me } = useAuthStore()
  const { openAuth } = useModal()

  const [profile,       setProfile]       = useState<User | null>(null)
  const [followers,     setFollowers]      = useState<User[]>([])
  const [following,     setFollowing]      = useState<User[]>([])
  const [loading,       setLoading]        = useState(true)
  const [followLoading, setFollowLoading]  = useState(false)
  const [isFollowing,   setIsFollowing]    = useState(false)
  const [activeTab,     setActiveTab]      = useState<UserProfileTab>('followers')

  const isOwnProfile = me?.id === id

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [profileRes, followersRes, followingRes] = await Promise.all([
        usersApi.getById(id),
        followsApi.getFollowers(id),
        followsApi.getFollowing(id),
      ])
      setProfile(profileRes)
      const fList: User[] = followersRes.follower ?? []
      const gList: User[] = followingRes.following ?? []
      setFollowers(fList)
      setFollowing(gList)
      if (me) setIsFollowing(fList.some(f => f.id === me.id))
    } catch {
      router.push('/projects')
    } finally {
      setLoading(false)
    }
  }, [id, me, router])

  useEffect(() => { load() }, [load])

  const handleFollow = async () => {
    if (!isAuthenticated) { openAuth('login'); return }
    if (!id) return
    setFollowLoading(true)
    try {
      if (isFollowing) {
        await followsApi.unfollow(id)
        setIsFollowing(false)
        setFollowers(prev => prev.filter(f => f.id !== me?.id))
      } else {
        await followsApi.follow(id)
        setIsFollowing(true)
        if (me) setFollowers(prev => [...prev, me as User])
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg ?? 'Something went wrong')
    } finally {
      setFollowLoading(false)
    }
  }

  const tabList = activeTab === 'followers' ? followers : following

  return {
    profile, followers, following, loading, followLoading,
    isFollowing, isOwnProfile, activeTab, setActiveTab, tabList, handleFollow,
  }
}
