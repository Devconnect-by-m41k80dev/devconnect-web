'use client'

import { Navbar } from '@/app/components/layout/Navbar'
import { Footer } from '@/app/components/layout/Footer'
import { ProfileSidebar } from '@/app/components/profile/ProfileSidebar'
import { ProfileSkills } from '@/app/components/profile/ProfileSkills'
import { ProfileApplicationsList } from '@/app/components/profile/ProfileApplicationsList'
import { ProfileEditForm } from '@/app/components/profile/ProfileEditForm'
import { useProfile } from '@/app/hooks/useProfile'


export default function ProfilePage() {
  const { user, form, updateField, editing, setEditing, saving, saveErr, handleSave, apps, appsLoad } = useProfile()

  if (!user) return null

  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1 space-y-5">
            <ProfileSidebar user={user} onEditClick={() => setEditing(true)} />
            <ProfileSkills skills={user.skills} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {editing && (
              <ProfileEditForm
                form={form}
                saving={saving}
                saveErr={saveErr}
                onClose={() => setEditing(false)}
                onSave={handleSave}
                onChange={updateField}
              />
            )}
            <ProfileApplicationsList apps={apps} loading={appsLoad} />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}



