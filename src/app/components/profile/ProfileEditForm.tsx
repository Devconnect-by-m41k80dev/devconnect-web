'use client'

import { X, Save } from 'lucide-react'
import { Spinner } from '@/app/components/ui/Spinner'
import { useI18n } from '@/app/i18n'
import { UpdateUserDto } from '@/app/types/dtos'

interface Props {
  form: Required<UpdateUserDto>
  saving: boolean
  saveErr: string
  onClose: () => void
  onSave: () => void
  onChange: (key: keyof Required<UpdateUserDto>, value: string) => void
}

export function ProfileEditForm({ form, saving, saveErr, onClose, onSave, onChange }: Props) {
  const { t } = useI18n()
  const fields = [
    { key: 'fullName'       as const, label: 'Full Name',            placeholder: 'John Doe' },
    { key: 'location'       as const, label: t.profile.locationLabel, placeholder: 'Madrid, Spain' },
    { key: 'github'         as const, label: t.profile.githubLabel,   placeholder: 'https://github.com/you' },
    { key: 'linkedin'       as const, label: t.profile.linkedinLabel, placeholder: 'https://linkedin.com/in/you' },
    { key: 'portfolio'      as const, label: t.profile.portfolioLabel,placeholder: 'https://yoursite.com' },
    { key: 'profileImageUrl'as const, label: t.profile.imageLabel,    placeholder: 'https://...' },
  ]

  return (
    <div className="dc-card p-6 anim-scale-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold" style={{ color: 'var(--text)' }}>{t.profile.editProfile}</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[--bg-overlay] transition-colors" style={{ color: 'var(--text-muted)' }}><X size={15} /></button>
      </div>
      {saveErr && (
        <div className="text-xs p-3 rounded-xl border mb-4" style={{ color: 'var(--danger)', background: 'color-mix(in srgb, var(--danger) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--danger) 20%, transparent)' }}>
          {saveErr}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="dc-label">{label}</label>
            <input type="text" value={form[key]} onChange={e => onChange(key, e.target.value)} placeholder={placeholder} className="dc-input" />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="dc-label">{t.profile.bioLabel}</label>
          <textarea value={form.bio} onChange={e => onChange('bio', e.target.value)} maxLength={350} rows={3} placeholder="Tell the community about yourself…" className="dc-input resize-none" />
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={onSave} disabled={saving} className="dc-btn-primary py-2.5 px-5 gap-1.5">
          {saving ? <><Spinner size="sm" /> {t.profile.saving}</> : <><Save size={13} /> {t.profile.saveChanges}</>}
        </button>
        <button onClick={onClose} className="dc-btn-ghost py-2.5 px-5">{t.profile.cancel}</button>
      </div>
    </div>
  )
}
