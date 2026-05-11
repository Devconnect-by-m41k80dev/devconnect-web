'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ProjectStatus } from '@/app/types/enums'
import { CreateProjectDto } from '@/app/types/dtos'
import { projectsApi } from '@/app/lib/api'

const schema = z.object({
  title:         z.string().min(1, 'Required').max(100),
  description:   z.string().min(10, 'Min 10 characters').max(2000),
  status:        z.nativeEnum(ProjectStatus).optional(),
  repositoryUrl: z.string().url().optional().or(z.literal('')),
  demoUrl:       z.string().url().optional().or(z.literal('')),
  docsUrl:       z.string().url().optional().or(z.literal('')),
})

export type NewProjectFormValues = z.infer<typeof schema>

export function useNewProject() {
  const router = useRouter()
  const [techStack,  setTechStack]  = useState<string[]>([])
  const [techInput,  setTechInput]  = useState('')
  const [loading,    setLoading]    = useState(false)
  const [apiError,   setApiError]   = useState('')

  const form = useForm<NewProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: ProjectStatus.IDEA },
  })

  const addTech = () => {
    const v = techInput.trim()
    if (v && !techStack.includes(v) && techStack.length < 20) {
      setTechStack(prev => [...prev, v])
      setTechInput('')
    }
  }

  const removeTech = (tech: string) =>
    setTechStack(prev => prev.filter(t => t !== tech))

  const onSubmit = async (values: NewProjectFormValues) => {
    setLoading(true)
    setApiError('')
    try {
      const payload: CreateProjectDto = {
        title:         values.title,
        description:   values.description,
        techStack:     techStack.length ? techStack : undefined,
        status:        values.status,
        repositoryUrl: values.repositoryUrl || undefined,
        demoUrl:       values.demoUrl       || undefined,
        docsUrl:       values.docsUrl       || undefined,
      }
      const res = await projectsApi.create(payload)
      router.push(`/projects/${res.id}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message
      setApiError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Something went wrong'))
    } finally {
      setLoading(false)
    }
  }

  return { form, techStack, techInput, setTechInput, addTech, removeTech, loading, apiError, onSubmit }
}
