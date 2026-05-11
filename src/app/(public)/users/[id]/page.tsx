"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/app/i18n";
import { useAuthStore } from "@/app/store/auth.store";
import { useModal } from "@/app/context/ModalContext";
import { usersApi, followsApi } from "@/app/lib/api";
import { Avatar } from "@/app/components/ui/Avatar";
import { Spinner } from "@/app/components/ui/Spinner";
import { Navbar } from "@/app/components/layout/Navbar";
import { Footer } from "@/app/components/layout/Footer";
import {
  MapPin,
  Calendar,
  Globe,
  UserPlus,
  UserMinus,
  ArrowLeft,
  ExternalLink,
  Users,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { SlSocialLinkedin } from "react-icons/sl";
import { User } from "@/app/types/entities";
import { formatDate, cn } from "@/app/lib/utils";

type Tab = "followers" | "following";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { isAuthenticated, user: me } = useAuthStore();
  const { openAuth } = useModal();

  const [profile, setProfile] = useState<User | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("followers");

  const isOwnProfile = me?.id === id;

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [profileRes, followersRes, followingRes] = await Promise.all([
        usersApi.getById(id),
        followsApi.getFollowers(id),
        followsApi.getFollowing(id),
      ]);
      setProfile(profileRes);

      const followerList: User[] = followersRes.follower ?? [];
      const followingList: User[] = followingRes.following ?? [];
      setFollowers(followerList);
      setFollowing(followingList);

      if (me) setIsFollowing(followerList.some((f) => f.id === me.id));
    } catch {
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  }, [id, me, router]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      openAuth("login");
      return;
    }
    if (!id) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await followsApi.unfollow(id);
        setIsFollowing(false);
        setFollowers((prev) => prev.filter((f) => f.id !== me?.id));
      } else {
        await followsApi.follow(id);
        setIsFollowing(true);
        if (me) setFollowers((prev) => [...prev, me as User]);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      alert(msg ?? t.common.error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (!profile) return null;

  const tabList = activeTab === "followers" ? followers : following;

  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:text-[--brand]"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-5">
            <div className="dc-card p-6 anim-fade-up">
              <div className="text-center mb-5">
                <Avatar
                  fullName={profile.fullName}
                  profileImageUrl={profile.profileImageUrl}
                  size="xl"
                  className="mx-auto mb-4"
                />
                <h1
                  className="font-display text-xl font-bold mb-1"
                  style={{ color: "var(--text)" }}
                >
                  {profile.fullName}
                </h1>
                {profile.professionalRole && (
                  <p className="text-sm" style={{ color: "var(--brand)" }}>
                    {profile.professionalRole.name}
                  </p>
                )}
              </div>

              <div
                className="grid grid-cols-2 divide-x rounded-xl overflow-hidden border mb-4"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  onClick={() => setActiveTab("followers")}
                  className={cn(
                    "py-3 text-center transition-colors",
                    activeTab === "followers"
                      ? "bg-[--bg-overlay]"
                      : "hover:bg-[--bg-overlay]",
                  )}
                >
                  <p
                    className="font-bold text-base leading-none"
                    style={{ color: "var(--text)" }}
                  >
                    {followers.length}
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Followers
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={cn(
                    "py-3 text-center transition-colors",
                    activeTab === "following"
                      ? "bg-[--bg-overlay]"
                      : "hover:bg-[--bg-overlay]",
                  )}
                >
                  <p
                    className="font-bold text-base leading-none"
                    style={{ color: "var(--text)" }}
                  >
                    {following.length}
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Following
                  </p>
                </button>
              </div>

              {!isOwnProfile && (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={cn(
                    "w-full py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 flex items-center justify-center gap-2",
                    isFollowing
                      ? "hover:border-[--danger] hover:text-[--danger]"
                      : "dc-btn-primary border-transparent",
                  )}
                  style={
                    isFollowing
                      ? {
                          borderColor: "var(--border)",
                          color: "var(--text-muted)",
                          background: "transparent",
                        }
                      : {}
                  }
                >
                  {followLoading ? (
                    <Spinner size="sm" />
                  ) : isFollowing ? (
                    <>
                      <UserMinus size={15} /> Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} /> Follow
                    </>
                  )}
                </button>
              )}

              {isOwnProfile && (
                <Link
                  href="/profile"
                  className="dc-btn-ghost w-full py-2.5 text-sm flex items-center justify-center gap-1.5"
                >
                  Edit my profile
                </Link>
              )}

              {profile.bio && (
                <p
                  className="text-sm leading-relaxed mt-5 pt-5 border-t"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  {profile.bio}
                </p>
              )}

              <div
                className="space-y-2 mt-4 pt-4 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                {profile.location && (
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <MapPin size={13} style={{ color: "var(--text-dim)" }} />
                    {profile.location}
                  </div>
                )}
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Calendar size={13} style={{ color: "var(--text-dim)" }} />
                  {t.profile.memberSince}{" "}
                  {formatDate(profile.createdAt, locale)}
                </div>
              </div>

              {(profile.github || profile.linkedin || profile.portfolio) && (
                <div
                  className="flex items-center gap-3 mt-4 pt-4 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border transition-all hover:border-[--brand] hover:text-[--brand]"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <SiGithub size={15} />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border transition-all hover:border-[--accent] hover:text-[--accent]"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <SlSocialLinkedin size={15} />
                    </a>
                  )}
                  {profile.portfolio && (
                    <a
                      href={profile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border transition-all hover:border-[--success] hover:text-[--success]"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Globe size={15} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {profile.skills && profile.skills.length > 0 && (
              <div className="dc-card p-5 anim-fade-up delay-1">
                <h3
                  className="font-semibold text-sm mb-3"
                  style={{ color: "var(--text)" }}
                >
                  {t.profile.skillsLabel}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <span
                      key={s.id}
                      className="font-mono text-xs px-2.5 py-1 rounded-lg border"
                      style={{
                        color: "var(--accent)",
                        borderColor:
                          "color-mix(in srgb, var(--accent) 22%, transparent)",
                        background:
                          "color-mix(in srgb, var(--accent) 7%, transparent)",
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4 anim-fade-up delay-1">
            <div
              className="flex items-center gap-1 p-1 rounded-xl border"
              style={{
                background: "var(--bg-raised)",
                borderColor: "var(--border)",
              }}
            >
              {(["followers", "following"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2",
                    activeTab === tab
                      ? "text-white"
                      : "text-[--text-muted] hover:text-[--text]",
                  )}
                  style={
                    activeTab === tab ? { background: "var(--brand)" } : {}
                  }
                >
                  <Users size={14} />
                  {tab === "followers"
                    ? `Followers (${followers.length})`
                    : `Following (${following.length})`}
                </button>
              ))}
            </div>

            {tabList.length === 0 ? (
              <div className="dc-card p-16 text-center">
                <Users
                  size={32}
                  className="mx-auto mb-3"
                  style={{ color: "var(--text-dim)" }}
                />
                <p
                  className="font-semibold mb-1"
                  style={{ color: "var(--text)" }}
                >
                  {activeTab === "followers"
                    ? "No followers yet"
                    : "Not following anyone yet"}
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {activeTab === "followers"
                    ? "When someone follows this user, they'll appear here."
                    : "When this user follows someone, they'll appear here."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tabList.map((u, i) => (
                  <Link
                    key={u.id}
                    href={`/users/${u.id}`}
                    className={cn(
                      "dc-card-interactive flex items-center gap-4 p-4 no-underline anim-fade-up",
                      `delay-${Math.min(i + 1, 5)}`,
                    )}
                  >
                    <Avatar
                      fullName={u.fullName}
                      profileImageUrl={u.profileImageUrl}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm truncate"
                        style={{ color: "var(--text)" }}
                      >
                        {u.fullName}
                      </p>
                      {u.professionalRole && (
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--brand)" }}
                        >
                          {u.professionalRole.name}
                        </p>
                      )}
                      {u.location && (
                        <p
                          className="text-xs flex items-center gap-1 mt-0.5"
                          style={{ color: "var(--text-dim)" }}
                        >
                          <MapPin size={10} /> {u.location}
                        </p>
                      )}
                    </div>

                    {u.skills && u.skills.length > 0 && (
                      <div className="hidden sm:flex flex-wrap gap-1 justify-end max-w-[130px]">
                        {u.skills.slice(0, 3).map((s) => (
                          <span
                            key={s.id}
                            className="font-mono text-[10px] px-2 py-0.5 rounded border"
                            style={{
                              color: "var(--text-dim)",
                              borderColor: "var(--border)",
                              background: "var(--bg-overlay)",
                            }}
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <ExternalLink
                      size={12}
                      className="shrink-0"
                      style={{ color: "var(--text-dim)" }}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <div className="dc-skeleton h-4 w-20 rounded mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-5">
            <div className="dc-card p-6">
              <div className="dc-skeleton w-16 h-16 rounded-xl mx-auto mb-4" />
              <div className="dc-skeleton h-5 w-1/2 rounded mx-auto mb-2" />
              <div className="dc-skeleton h-3 w-1/3 rounded mx-auto mb-4" />
              <div className="dc-skeleton h-9 w-full rounded-xl mb-2" />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-3">
            <div className="dc-skeleton h-12 w-full rounded-xl" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="dc-card p-4 flex items-center gap-4">
                <div className="dc-skeleton w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="dc-skeleton h-4 w-1/3 rounded" />
                  <div className="dc-skeleton h-3 w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
