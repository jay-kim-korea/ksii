import Link from "next/link";

// 일반 메뉴: 홈 페이지의 앵커 섹션. 다른 페이지에서 클릭해도 / 로 이동 후 해당 섹션으로 스크롤.
const anchorNav = [
  { label: "협회 소개", href: "/#about" },
  { label: "주요사업", href: "/#business" },
  { label: "뉴스룸", href: "/#news" },
  { label: "채용정보", href: "/#careers" },
];

export function Header() {
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
          <Link
            href="/login"
            className="rounded-md bg-teal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal/90"
          >
            로그인
          </Link>
        </nav>

        {/* 모바일: 로그인 버튼만 (햄버거 메뉴는 후속 작업) */}
        <Link
          href="/login"
          className="rounded-md bg-teal px-3 py-1.5 text-sm font-medium text-white md:hidden"
        >
          로그인
        </Link>
      </div>
    </header>
  );
}
