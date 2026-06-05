import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

const benefits = [
  {
    title: "보조금 정보 우선 안내",
    body: "회원사 대상 정부·지자체 보조금 정보를 가장 빠르게 받아보세요.",
  },
  {
    title: "회원 전용 자료실",
    body: "산업 보고서·정책 자료·시장 데이터를 제한 없이 열람할 수 있습니다.",
  },
  {
    title: "정기 네트워킹",
    body: "회원사 간 교류, 협회 주최 세미나·간담회에 우선 참여하실 수 있습니다.",
  },
];

export function MembersSection() {
  return (
    <section
      id="members"
      className="relative overflow-hidden bg-navy py-24 text-white md:py-40"
    >
      {/* 배경 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,152,170,0.45)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(217,184,184,0.15)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 dot-pattern opacity-50" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <SectionReveal>
          <p className="eyebrow mb-6">MEMBERSHIP</p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-6xl">
            지금 회원으로 가입하고
            <br />
            <span className="text-teal">한 발 앞선 정보</span>를 만나보세요
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            수산식품 산업의 모든 정보를 회원사에게 가장 먼저, 가장 자세히 전달합니다.
          </p>
        </SectionReveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/5 text-left md:grid-cols-3">
          {benefits.map((b, i) => (
            <SectionReveal key={b.title} delay={i * 120}>
              <div className="h-full bg-navy/70 p-8 md:p-10">
                <h3 className="text-lg font-semibold md:text-xl">
                  {b.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/65">
                  {b.body}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={400}>
          <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-md bg-teal px-8 py-4 text-base font-medium text-white transition-all hover:bg-teal/90 hover:gap-3"
            >
              지금 회원가입
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-8 py-4 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              이미 회원이신가요? 로그인
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
