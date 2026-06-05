import { SectionReveal } from "./SectionReveal";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-navy text-white md:min-h-screen">
      {/* 배경 레이어 1: 우측 상단 teal 광채 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,152,170,0.45)_0%,_transparent_55%)]" />
      {/* 배경 레이어 2: 좌측 하단 blush 광채 (매우 옅게) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(217,184,184,0.18)_0%,_transparent_50%)]" />
      {/* 배경 레이어 3: 도트 패턴 */}
      <div className="absolute inset-0 dot-pattern opacity-60" />
      {/* 하단 페이드 — 다음 섹션으로의 자연스러운 전환 */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-navy" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <SectionReveal>
          <p className="eyebrow mb-8">
            KOREA SEAFOOD FOOD INDUSTRY ASSOCIATION
          </p>
        </SectionReveal>

        <SectionReveal delay={150}>
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight md:text-6xl lg:text-7xl">
            한국 수산식품산업의
            <br />
            <span className="text-teal">지속가능한 미래</span>를 만듭니다
          </h1>
        </SectionReveal>

        <SectionReveal delay={300}>
          <p className="mx-auto mt-10 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
            정부 보조금과 지원사업 정보를 한 곳에서 확인하고,
            <br />
            업계 동향과 정책 변화를 가장 빠르게 파악하며,
            <br />
            수산식품 산업의 내일을 회원사와 함께 만들어 갑니다.
          </p>
        </SectionReveal>
      </div>

      {/* SCROLL DOWN 인디케이터 */}
      <a
        href="#about"
        aria-label="아래 섹션으로 이동"
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/60 transition-colors hover:text-white"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
          Scroll Down
        </span>
        <span className="block h-12 w-px overflow-hidden">
          <span className="block h-full w-full origin-top bg-white/70 animate-scroll-line" />
        </span>
      </a>
    </section>
  );
}
