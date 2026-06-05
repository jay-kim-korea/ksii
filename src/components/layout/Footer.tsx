import Link from "next/link";

const footerLinks = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "문의하기", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          {/* 좌측: 협회 정보 */}
          <div className="max-w-xl space-y-3">
            <p className="text-lg font-bold tracking-tight">
              한국수산식품산업협회
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-mute">
              Korea Seafood Food Industry Association
            </p>
            <p className="pt-2 text-base leading-relaxed text-white/80">
              한국 수산식품산업의 지속가능한 미래를 만듭니다.
            </p>
            <p className="pt-4 text-sm leading-relaxed text-white/60">
              인천광역시 중구 축항대로69번길 20
              <br />
              인천국제수산물타운 A동 309호
            </p>
            {/* 연락처는 추후 추가 예정 */}
          </div>

          {/* 우측: 정책 / 문의 링크 */}
          <nav className="flex flex-col gap-3 md:items-end">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 하단 카피라이트 바 */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-white/50">
            © 2026 한국수산식품산업협회. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
