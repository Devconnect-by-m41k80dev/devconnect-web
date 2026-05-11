'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/app/i18n'
import { useAuthStore } from '@/app/store/auth.store'
import { authApi, metadataApi } from '@/app/lib/api'
import { Spinner } from '@/app/components/ui/Spinner'
import { Eye, EyeOff, AlertCircle, ArrowRight, Check } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import type { Skill, ProfessionalRole } from '@/app/types/entities'

const PASSWORD_REGEX = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
const schema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).max(50).regex(PASSWORD_REGEX),
  professionalRoleId: z.string().uuid('Select a professional role'),
})
type FormValues = z.infer<typeof schema>

export function RegisterForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess?: () => void }) {
  const { t } = useI18n()
  const router = useRouter()
  const { fetchMe } = useAuthStore()

  const [showPass, setShowPass] = useState(false)
  const [apiError, setApiError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [roles, setRoles] = useState<ProfessionalRole[]>([])
  const [metaReady, setMetaReady] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    metadataApi.getRegisterMetadata().then(res => {
      setSkills(res.skills ?? [])
      setRoles(res.professionalRoles ?? [])
    }).finally(() => setMetaReady(true))
  }, [])

  const toggleSkill = (id: string) => setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setApiError('')
    try {
      await authApi.register({ ...values, skills: selectedSkills.length ? selectedSkills : undefined })
      await authApi.login({ email: values.email, password: values.password })
      await fetchMe()
      onSuccess?.()
      router.push('/projects')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message
      setApiError(Array.isArray(msg) ? msg.join(', ') : (msg ?? t.common.error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {apiError && <div className="flex items-center gap-2 text-sm text-red-600"><AlertCircle size={15} />{apiError}</div>}

      <input {...register('fullName')} type="text" placeholder={t.auth.fullName} className={cn('dc-input', errors.fullName && 'dc-input-error')} />
      <input {...register('email')} type="email" placeholder={t.auth.email} className={cn('dc-input', errors.email && 'dc-input-error')} />
      <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder={t.auth.password} className={cn('dc-input', errors.password && 'dc-input-error')} />
      <button type="button" onClick={() => setShowPass(v => !v)}>{showPass ? <EyeOff /> : <Eye />}</button>

     
      <select {...register('professionalRoleId')} className="dc-input">
        <option value="" disabled>{t.auth.rolePlaceholder}</option>
        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>

    
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => {
          const selected = selectedSkills.includes(skill.id)
          return (
            <button key={skill.id} type="button" onClick={() => toggleSkill(skill.id)}
              className={cn(selected ? 'bg-brand text-white' : 'border text-gray-500', 'px-3 py-1 rounded')}>
              {selected && <Check size={12} />} {skill.name}
            </button>
          )
        })}
      </div>

      <button type="submit" disabled={loading} className="dc-btn-primary w-full py-3">
        {loading ? <><Spinner size="sm" /> {t.auth.loading}</> : <>{t.auth.registerBtn} <ArrowRight size={16} /></>}
      </button>

      <p className="text-center text-sm mt-3">
        {t.auth.hasAccount}{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-brand hover:underline">{t.auth.signIn}</button>
      </p>
    </form>
  )
}