'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/app/i18n'
import { useAuthStore } from '@/app/store/auth.store'
import { authApi } from '@/app/lib/api'
import { Spinner } from '@/app/components/ui/Spinner'
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/app/lib/utils'

const PASSWORD_REGEX = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50).regex(PASSWORD_REGEX),
})
type FormValues = z.infer<typeof schema>

export function LoginForm({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess?: () => void }) {
  const { t } = useI18n()
  const router = useRouter()
  const { fetchMe } = useAuthStore()

  const [showPass, setShowPass] = useState(false)
  const [apiError, setApiError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setApiError('')
    try {
      await authApi.login(values)
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
      
      <input {...register('email')} type="email" placeholder={t.auth.email} className={cn('dc-input', errors.email && 'dc-input-error')} />
      <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder={t.auth.password} className={cn('dc-input', errors.password && 'dc-input-error')} />
      <button type="button" onClick={() => setShowPass(v => !v)}>{showPass ? <EyeOff /> : <Eye />}</button>

      <button type="submit" disabled={loading} className="dc-btn-primary w-full py-3">
        {loading ? <><Spinner size="sm" /> {t.auth.loading}</> : <>{t.auth.loginBtn} <ArrowRight size={16} /></>}
      </button>

      <p className="text-center text-sm mt-3">
        {t.auth.noAccount}{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-brand hover:underline">{t.auth.signUp}</button>
      </p>
    </form>
  )
}