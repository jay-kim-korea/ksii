import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// 일반 메뉴: 홈 페이지의 앵커 섹션. 다른 페이지에서 클릭해도 / 로 이동 후 해당 섹션으로 스크롤.
const anchorNav = [
  { label: "협회 소개", href: "/#about" },
  { label: "주요사업", href: "/#business" },
  { label: "뉴스룸", href: "/#news" },
  { label: "채용정보", href: "/#careers" },
];

// 헤더는 매 요청마다 세션을 확인해야 하므로 서버 컴포넌트(async).
// 로그인 상태에 따라 우측 액션 영역이 분기됨.
export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: "admin" | "member" | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("member_profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = (profile?.role as "admin" | "member" | null) ?? null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-navy/95 text-white backdrop-blur supports-[backdrop-filter]:bg-navy/85">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        {/* 좌측: 협회명 (홈 링크) */}
        <Link
          href="/"
          className="text-base font-bold tracking-tight transition-opacity hover:opacity-90"
        >
          한국수산식품산업협회
        </Link>

        {/* 우측: 데스크탑 메뉴 */}
        <nav className="hidden items-center gap-8 md:flex">
          {anchorNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-white/75 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/members"
            className="text-sm text-white/75 transition-colors hover:text-white"
          >
            회원전용 정보
          </Link>

          <HeaderAuthAction user={user} role={role} />
        </nav>

        {/* 모바일: 인증 상태에 따른 단일 버튼 (햄버거 메뉴는 후속 작업) */}
        <div className="md:hidden">
          <HeaderAuthAction user={user} role={role} compact />
        </div>
      </div>
    </header>
  );
}

type AuthUser = { email?: string | null } | null;

function HeaderAuthAction({
  user,
  role,
  compact = false,
}: {
  user: AuthUser;
  role: "admin" | "member" | null;
  compact?: boolean;
}) {
  const buttonClass = compact
    ? "rounded-md bg-teal px-3 py-1.5 text-sm font-medium text-white"
    : "rounded-md bg-teal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal/90";

  // 비로그인
  if (!user) {
    return (
      <Link href="/login" className={buttonClass}>
        로그인
      </Link>
    );
  }

  // 관리자: 어드민 페이지 진입 버튼 + 로그아웃
  if (role === "admin") {
    return (
      <div className="flex items-center gap-3">
        <Link href="/admin" className={buttonClass}>
          관리자 페이지
        </Link>
        {!compact && <LogoutButton />}
      </div>
    );
  }

  // 일반 회원: 로그아웃만 (회원 영역 메뉴는 기존 "회원전용 정보" 링크 사용)
  return <LogoutButton compact={compact} />;
}

function LogoutButton({ compact = false }: { compact?: boolean }) {
  async function logout() {
    "use server";
    const sb = await createClient();
    await sb.auth.signOut();
    redirect("/");
  }

  return (
    <form action={logout}>
      <button
        type="submit"
        className={
          compact
            ? "rounded-md bg-teal px-3 py-1.5 text-sm font-medium text-white"
            : "text-sm text-white/75 transition-colors hover:text-white"
        }
      >
        로그아웃
      </button>
    </form>
  );
}
