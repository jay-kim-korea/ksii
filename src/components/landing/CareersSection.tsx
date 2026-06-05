import { ArrowRight } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

export function CareersSection() {
  return (
    <section id="careers" className="bg-ivory py-24 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-24">
        {/* 좌측: 텍스트 */}
        <SectionReveal>
          <p className="eyebrow mb-6">CAREERS</p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-navy md:text-5xl">
            함께 만들어 갈
            <br />
            <span className="text-teal">동료</span>를 찾습니다
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-navy/70 md:text-lg">
            수산식품 산업의 미래를 함께 그릴 분들을 기다립니다.
            정책 분석, 회원 서비스, 데이터 운영 등 다양한 영역에서
            새로운 동료를 찾고 있습니다.
          </p>
        </SectionReveal>

        {/* 우측: CTA 카드 */}
        <SectionReveal delay={150}>
          <a
            href="/careers"
            className="group relative block overflow-hidden rounded-md bg-navy p-10 text-white transition-transform hover:-translate-y-1 md:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(0,152,170,0.4)_0%,_transparent_60%)]" />
            <div className="absolute inset-0 dot-pattern opacity-40" />
            <div className="relative z-10">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-teal">
                Now Hiring
              </p>
              <p className="mt-5 text-2xl font-semibold leading-tight md:text-3xl">
                채용 중인 포지션
                <br />
                바로 확인하기
              </p>
              <span className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-all group-hover:gap-3">
                채용 공고 보기
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        </SectionReveal>
      </div>
    </section>
  );
}
