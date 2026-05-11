'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/app/store/auth.store'
import { usersApi, projectsApi } from '@/app/lib/api'
import { UpdateUserDto } from '@/app/types/dtos'
import { AppliedProject } from '@/app/types/entities/applied-project.entity'

export function useProfile() {
  const { user, fetchMe } = useAuthStore()

  const [editing,  setEditing]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [saveErr,  setSaveErr]  = useState('')
  const [apps,     setApps]     = useState<AppliedProject[]>([])
  const [appsLoad, setAppsLoad] = useState(true)

  const [form, setForm] = useState<Required<UpdateUserDto>>({
    fullName: user?.fullName ?? '', bio: user?.bio ?? '',
    location: user?.location ?? '', github: user?.github ?? '',
    linkedin: user?.linkedin ?? '', portfolio: user?.portfolio ?? '',
    profileImageUrl: user?.profileImageUrl ?? '',
  })

  useEffect(() => {
    if (user) setForm({
      fullName: user.fullName ?? '', bio: user.bio ?? '',
      location: user.location ?? '', github: user.github ?? '',
      linkedin: user.linkedin ?? '', portfolio: user.portfolio ?? '',
      profileImageUrl: user.profileImageUrl ?? '',
    })
  }, [user])

  useEffect(() => {
    projectsApi.getApplied().then(setApps).finally(() => setAppsLoad(false))
  }, [])

  const updateField = (key: keyof Required<UpdateUserDto>, value: string) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSave = async () => {
    setSaving(true); setSaveErr('')
    try {
      const payload: UpdateUserDto = {}
      const fields = ['fullName', 'bio', 'location', 'github', 'linkedin', 'portfolio', 'profileImageUrl'] as const
      fields.forEach(k => { if (form[k]) payload[k] = form[k] })
      await usersApi.updateProfile(payload)
      await fetchMe()
      setEditing(false)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message
      setSaveErr(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Something went wrong'))
    } finally {
      setSaving(false)
    }
  }

  return { user, form, updateField, editing, setEditing, saving, saveErr, handleSave, apps, appsLoad }
}
