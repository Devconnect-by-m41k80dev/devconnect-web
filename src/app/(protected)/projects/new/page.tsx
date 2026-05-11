'use client'

import Link from 'next/link'
import { Plus, ArrowLeft, AlertCircle } from 'lucide-react'
import { useI18n } from '@/app/i18n'
import { useNewProject } from '@/app/hooks/useNewProject'
import { Navbar } from '@/app/components/layout/Navbar'
import { Spinner } from '@/app/components/ui/Spinner'
import { TechStackInput } from '@/app/components/projects/form/TechStackInput'
import { StatusPicker } from '@/app/components/projects/form/StatusPicker'
import { cn } from '@/app/lib/utils'

export default function NewProjectPage() {
  const { t } = useI18n()
  const { form, techStack, techInput, setTechInput, addTech, removeTech, loading, apiError, onSubmit } = useNewProject()
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form

  const urlFields = [
    { key: 'repositoryUrl' as const, label: t.project.repository, placeholder: 'https://github.com/…' },
    { key: 'demoUrl'       as const, label: t.project.demo,       placeholder: 'https://…' },
    { key: 'docsUrl'       as const, label: t.project.docs,       placeholder: 'https://docs.…' },
  ]

  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <div className="mx-auto max-w-2xl">

          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm mb-8 hover:text-[--brand] transition-colors" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={14} /> {t.project.back}
          </Link>

          <div className="anim-fade-up">
            <h1 className="dc-page-title mb-1.5">{t.projects.createNew}</h1>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Share your project with the DevConnect community and find collaborators.</p>
          </div>

          {apiError && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl border mb-6 text-sm anim-scale-in" style={{ background: 'color-mix(in srgb, var(--danger) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--danger) 20%, transparent)', color: 'var(--danger)' }}>
              <AlertCircle size={14} /> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 anim-fade-up delay-1">

            <div>
              <label className="dc-label">Title *</label>
              <input {...register('title')} type="text" placeholder="e.g. Open Source Dashboard" className={cn('dc-input', errors.title && 'dc-input-error')} />
              {errors.title && <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>{errors.title.message}</p>}
            </div>

            <div>
              <label className="dc-label">Description *</label>
              <textarea {...register('description')} rows={5} placeholder="Describe what you're building…" className={cn('dc-input resize-none', errors.description && 'dc-input-error')} />
              {errors.description && <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>{errors.description.message}</p>}
            </div>

            <StatusPicker selected={watch('status')} onSelect={s => setValue('status', s)} />

            <TechStackInput techStack={techStack} techInput={techInput} onInput={setTechInput} onAdd={addTech} onRemove={removeTech} />

            <div className="grid sm:grid-cols-3 gap-4">
              {urlFields.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="dc-label">{label} <span className="text-xs ml-1" style={{ color: 'var(--text-dim)' }}>({t.common.optional})</span></label>
                  <input {...register(key)} type="url" placeholder={placeholder} className={cn('dc-input text-sm', errors[key] && 'dc-input-error')} />
                  {errors[key] && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors[key]?.message}</p>}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="dc-btn-primary py-3 px-7 text-base">
                {loading ? <><Spinner size="sm" /> {t.common.loading}</> : <><Plus size={16} /> {t.projects.createNew}</>}
              </button>
              <Link href="/projects" className="dc-btn-ghost py-3 px-7 text-base">Cancel</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}




