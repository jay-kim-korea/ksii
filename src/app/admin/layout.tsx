import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

// 로컬 개발 환경에서만 인증 우회. `next dev` 시에만 NODE_ENV='development'.
// 빌드/배포는 NODE_ENV='production' → 우회 자동 차단.
const IS_DEV_BYPASS = process.env.NODE_ENV === "development";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string;

  if (IS_DEV_BYPASS) {
    // 로컬 개발 — 로그인 게이트 우회. 프로덕션에서는 이 분기가 절대 실행되지 않음.
    userEmail = "[DEV] 로그인 우회 모드";
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: profile } = await supabase
      .from("member_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      redirect("/");
    }

    userEmail = user.email ?? "(no email)";
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 관리자 전용 헤더 */}
      <div
        className={
          "border-b " +
          (IS_DEV_BYPASS
            ? "border-amber-300 bg-amber-50"
            : "border-navy/10 bg-ivory/40")
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm font-semibold text-navy hover:opacity-80"
            >
              관리자 콘솔
            </Link>
            <span
              className={
                "text-xs " +
                (IS_DEV_BYPASS ? "font-medium text-amber-700" : "text-mute")
              }
            >
              {userEmail}
            </span>
          </div>

          {/* 우회 모드에서는 로그아웃 숨김 (세션 없음) */}
          {!IS_DEV_BYPASS && (
            <form
              action={async () => {
                "use server";
                const sb = await createClient();
                await sb.auth.signOut();
                redirect("/login");
              }}
            >
              <button
                type="submit"
                className="text-xs font-medium text-navy/70 transition-colors hover:text-navy"
              >
                로그아웃
              </button>
            </form>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
