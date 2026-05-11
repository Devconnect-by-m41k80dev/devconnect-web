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





// "use client";

// import { useState, useEffect } from "react";
// import {
//   Edit2,
//   Save,
//   X,
//   MapPin,
//   Calendar,
//   Globe,
//   ExternalLink,
// } from "lucide-react";
// import Link from "next/link";
// import { useI18n } from "@/app/i18n";
// import { useAuthStore } from "@/app/store/auth.store";
// import { UpdateUserDto } from "@/app/types/dtos";
// import { projectsApi, usersApi } from "@/app/lib/api";
// import { Navbar } from "@/app/components/layout/Navbar";
// import { Avatar } from "@/app/components/ui/Avatar";
// import { formatDate } from "@/app/lib/utils";
// import { SlSocialLinkedin } from "react-icons/sl";
// import { SiGithub } from "react-icons/si";
// import { Spinner } from "@/app/components/ui/Spinner";
// import { ApplicationStatusBadge } from "@/app/components/ui/Badge";
// import { Footer } from "@/app/components/layout/Footer";
// import { AppliedProject } from "@/app/types/entities/applied-project.entity";

// export default function ProfilePage() {
//   const { t, locale } = useI18n();
//   const { user, fetchMe } = useAuthStore();

//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [saveErr, setSaveErr] = useState("");
//   const [apps, setApps] = useState<AppliedProject[]>([]);
//   const [appsLoad, setAppsLoad] = useState(true);

//   const [form, setForm] = useState<Required<UpdateUserDto>>({
//     fullName: user?.fullName ?? "",
//     bio: user?.bio ?? "",
//     location: user?.location ?? "",
//     github: user?.github ?? "",
//     linkedin: user?.linkedin ?? "",
//     portfolio: user?.portfolio ?? "",
//     profileImageUrl: user?.profileImageUrl ?? "",
//   });

//   useEffect(() => {
//     if (user) {
//       setForm({
//         fullName: user.fullName ?? "",
//         bio: user.bio ?? "",
//         location: user.location ?? "",
//         github: user.github ?? "",
//         linkedin: user.linkedin ?? "",
//         portfolio: user.portfolio ?? "",
//         profileImageUrl: user.profileImageUrl ?? "",
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     projectsApi
//       .getApplied()
//       .then(setApps)
//       .finally(() => setAppsLoad(false));
//   }, []);

//   const handleSave = async () => {
//     setSaving(true);
//     setSaveErr("");
//     try {
//       const payload: UpdateUserDto = {};
//       if (form.fullName) payload.fullName = form.fullName;
//       if (form.bio) payload.bio = form.bio;
//       if (form.location) payload.location = form.location;
//       if (form.github) payload.github = form.github;
//       if (form.linkedin) payload.linkedin = form.linkedin;
//       if (form.portfolio) payload.portfolio = form.portfolio;
//       if (form.profileImageUrl) payload.profileImageUrl = form.profileImageUrl;
//       await usersApi.updateProfile(payload);
//       await fetchMe();
//       setEditing(false);
//     } catch (err: unknown) {
//       const msg = (
//         err as { response?: { data?: { message?: string | string[] } } }
//       )?.response?.data?.message;
//       setSaveErr(Array.isArray(msg) ? msg.join(", ") : (msg ?? t.common.error));
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="dc-page">
//       <Navbar />
//       <main className="dc-container">
//         <div className="grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-1 space-y-5">
//             <div className="dc-card p-6 text-center anim-fade-up">
//               <Avatar
//                 fullName={user.fullName}
//                 profileImageUrl={user.profileImageUrl}
//                 size="xl"
//                 className="mx-auto mb-4"
//               />
//               <h1
//                 className="font-display text-xl font-bold mb-1"
//                 style={{ color: "var(--text)" }}
//               >
//                 {user.fullName}
//               </h1>
//               {user.professionalRole && (
//                 <p className="text-sm mb-3" style={{ color: "var(--brand)" }}>
//                   {user.professionalRole.name}
//                 </p>
//               )}
//               {user.bio && (
//                 <p
//                   className="text-sm leading-relaxed mb-4"
//                   style={{ color: "var(--text-muted)" }}
//                 >
//                   {user.bio}
//                 </p>
//               )}

//               <div className="space-y-2 text-left mt-3">
//                 {user.location && (
//                   <div
//                     className="flex items-center gap-2 text-sm"
//                     style={{ color: "var(--text-muted)" }}
//                   >
//                     <MapPin size={13} style={{ color: "var(--text-dim)" }} />
//                     {user.location}
//                   </div>
//                 )}
//                 <div
//                   className="flex items-center gap-2 text-sm"
//                   style={{ color: "var(--text-muted)" }}
//                 >
//                   <Calendar size={13} style={{ color: "var(--text-dim)" }} />
//                   {t.profile.memberSince} {formatDate(user.createdAt, locale)}
//                 </div>
//               </div>

//               {(user.github || user.linkedin || user.portfolio) && (
//                 <div
//                   className="flex items-center justify-center gap-3 mt-5 pt-5 border-t"
//                   style={{ borderColor: "var(--border)" }}
//                 >
//                   {user.github && (
//                     <a
//                       href={user.github}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 rounded-lg border transition-all hover:border-[--brand] hover:text-[--brand]"
//                       style={{
//                         borderColor: "var(--border)",
//                         color: "var(--text-muted)",
//                       }}
//                     >
//                       <SiGithub size={15} />
//                     </a>
//                   )}
//                   {user.linkedin && (
//                     <a
//                       href={user.linkedin}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 rounded-lg border transition-all hover:border-[--accent] hover:text-[--accent]"
//                       style={{
//                         borderColor: "var(--border)",
//                         color: "var(--text-muted)",
//                       }}
//                     >
//                       <SlSocialLinkedin size={15} />
//                     </a>
//                   )}
//                   {user.portfolio && (
//                     <a
//                       href={user.portfolio}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 rounded-lg border transition-all hover:border-[--success] hover:text-[--success]"
//                       style={{
//                         borderColor: "var(--border)",
//                         color: "var(--text-muted)",
//                       }}
//                     >
//                       <Globe size={15} />
//                     </a>
//                   )}
//                 </div>
//               )}

//               <button
//                 onClick={() => setEditing(true)}
//                 className="dc-btn-ghost w-full mt-5 py-2 text-sm gap-1.5"
//               >
//                 <Edit2 size={13} /> {t.profile.editProfile}
//               </button>

//               <Link
//                 href={`/users/${user.id}`}
//                 className="mt-2 text-xs flex items-center justify-center gap-1 transition-colors hover:text-[--brand]"
//                 style={{ color: "var(--text-dim)" }}
//               >
//                 <ExternalLink size={11} /> View public profile
//               </Link>
//             </div>

//             {user.skills && user.skills.length > 0 && (
//               <div className="dc-card p-5 anim-fade-up delay-1">
//                 <h3
//                   className="font-semibold text-sm mb-3"
//                   style={{ color: "var(--text)" }}
//                 >
//                   {t.profile.skillsLabel}
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {user.skills.map((s) => (
//                     <span
//                       key={s.id}
//                       className="font-mono text-xs px-2.5 py-1 rounded-lg border"
//                       style={{
//                         color: "var(--accent)",
//                         borderColor:
//                           "color-mix(in srgb, var(--accent) 22%, transparent)",
//                         background:
//                           "color-mix(in srgb, var(--accent) 7%, transparent)",
//                       }}
//                     >
//                       {s.name}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Main */}
//           <div className="lg:col-span-2 space-y-6">
//             {editing && (
//               <div className="dc-card p-6 anim-scale-in">
//                 <div className="flex items-center justify-between mb-5">
//                   <h2
//                     className="font-semibold"
//                     style={{ color: "var(--text)" }}
//                   >
//                     {t.profile.editProfile}
//                   </h2>
//                   <button
//                     onClick={() => setEditing(false)}
//                     className="p-1.5 rounded-lg hover:bg-[--bg-overlay] transition-colors"
//                     style={{ color: "var(--text-muted)" }}
//                   >
//                     <X size={15} />
//                   </button>
//                 </div>

//                 {saveErr && (
//                   <div
//                     className="text-xs p-3 rounded-xl border mb-4"
//                     style={{
//                       color: "var(--danger)",
//                       background:
//                         "color-mix(in srgb, var(--danger) 8%, transparent)",
//                       borderColor:
//                         "color-mix(in srgb, var(--danger) 20%, transparent)",
//                     }}
//                   >
//                     {saveErr}
//                   </div>
//                 )}

//                 <div className="grid sm:grid-cols-2 gap-4">
//                   {(
//                     [
//                       {
//                         key: "fullName",
//                         label: "Full Name",
//                         placeholder: "John Doe",
//                       },
//                       {
//                         key: "location",
//                         label: t.profile.locationLabel,
//                         placeholder: "Madrid, Spain",
//                       },
//                       {
//                         key: "github",
//                         label: t.profile.githubLabel,
//                         placeholder: "https://github.com/you",
//                       },
//                       {
//                         key: "linkedin",
//                         label: t.profile.linkedinLabel,
//                         placeholder: "https://linkedin.com/in/you",
//                       },
//                       {
//                         key: "portfolio",
//                         label: t.profile.portfolioLabel,
//                         placeholder: "https://yoursite.com",
//                       },
//                       {
//                         key: "profileImageUrl",
//                         label: t.profile.imageLabel,
//                         placeholder: "https://...",
//                       },
//                     ] as const
//                   ).map(({ key, label, placeholder }) => (
//                     <div key={key}>
//                       <label className="dc-label">{label}</label>
//                       <input
//                         type="text"
//                         value={form[key]}
//                         onChange={(e) =>
//                           setForm((f) => ({ ...f, [key]: e.target.value }))
//                         }
//                         placeholder={placeholder}
//                         className="dc-input"
//                       />
//                     </div>
//                   ))}
//                   <div className="sm:col-span-2">
//                     <label className="dc-label">{t.profile.bioLabel}</label>
//                     <textarea
//                       value={form.bio}
//                       onChange={(e) =>
//                         setForm((f) => ({ ...f, bio: e.target.value }))
//                       }
//                       maxLength={350}
//                       rows={3}
//                       placeholder="Tell the community about yourself…"
//                       className="dc-input resize-none"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex gap-3 mt-5">
//                   <button
//                     onClick={handleSave}
//                     disabled={saving}
//                     className="dc-btn-primary py-2.5 px-5 gap-1.5"
//                   >
//                     {saving ? (
//                       <>
//                         <Spinner size="sm" /> {t.profile.saving}
//                       </>
//                     ) : (
//                       <>
//                         <Save size={13} /> {t.profile.saveChanges}
//                       </>
//                     )}
//                   </button>
//                   <button
//                     onClick={() => setEditing(false)}
//                     className="dc-btn-ghost py-2.5 px-5"
//                   >
//                     {t.profile.cancel}
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="anim-fade-up delay-1">
//               <h2
//                 className="font-semibold mb-4"
//                 style={{ color: "var(--text)" }}
//               >
//                 {t.profile.applications}
//               </h2>

//               {appsLoad ? (
//                 <div className="space-y-3">
//                   {[1, 2, 3].map((i) => (
//                     <div key={i} className="dc-card p-4">
//                       <div className="dc-skeleton h-4 w-1/3 rounded mb-2" />
//                       <div className="dc-skeleton h-3 w-1/2 rounded" />
//                     </div>
//                   ))}
//                 </div>
//               ) : apps.length === 0 ? (
//                 <div className="dc-card p-10 text-center">
//                   <p className="text-sm" style={{ color: "var(--text-muted)" }}>
//                     {t.profile.noApplications}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {apps.map((app, i) => (
//                     <div
//                       key={app.applicationId}
//                       className={`dc-card p-4 flex items-center gap-4 anim-fade-up delay-${Math.min(i + 1, 5)}`}
//                     >
//                       <div className="flex-1 min-w-0">
//                         <Link
//                           href={`/projects/${app.project?.id}`}
//                           className="text-sm font-medium hover:text-[--brand] transition-colors truncate block"
//                           style={{ color: "var(--text)" }}
//                         >
//                           {app.project?.title}
//                         </Link>
//                         {app.message && (
//                           <p
//                             className="text-xs truncate mt-0.5"
//                             style={{ color: "var(--text-muted)" }}
//                           >
//                             {app.message}
//                           </p>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-2.5 flex-shrink-0">
//                         <ApplicationStatusBadge
//                           status={app.status}
//                           locale={locale}
//                         />
//                         <Link
//                           href={`/projects/${app.project?.id}`}
//                           className="p-1.5 rounded-lg hover:bg-[--bg-overlay] transition-colors"
//                           style={{ color: "var(--text-dim)" }}
//                         >
//                           <ExternalLink size={12} />
//                         </Link>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }
