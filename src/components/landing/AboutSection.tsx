import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

export function AboutSection() {
  return (
    <section id="about" className="relative bg-white">
      {/* 외부 max-width 제약 제거 — 이미지가 뷰포트 오른쪽 끝까지 닿도록 */}
      <div className="grid md:grid-cols-2">
        {/* 좌측: 텍스트 — 콘텐츠는 max-w-xl로 가독성 유지, md+에선 우측 정렬로 이미지 경계까지 다가감 */}
        <div className="flex items-center px-6 py-16 md:py-0 md:pl-10 md:pr-8 lg:pl-16 lg:pr-12 xl:pl-24">
          <SectionReveal>
            <div className="max-w-xl md:ml-auto">
              <p className="eyebrow mb-6">ABOUT US</p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-navy md:text-5xl">
                한국 수산식품산업을
                <br />
                대표하는 협회
              </h2>
              <p className="mt-8 text-base leading-relaxed text-navy/70 md:text-lg">
                한국수산식품산업협회는 수산식품 업계 회원사를 대표하여
                산업의 지속 가능한 성장과 국가 식품 안보에 기여합니다.
                정부·지자체와 회원사를 연결하고, 산업 발전을 위한 정책 제언과
                국내외 시장 동향을 공유합니다.
              </p>
              <a
                href="#business"
                className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-teal transition-all hover:gap-3"
              >
                협회 활동 자세히 보기
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </SectionReveal>
        </div>

        {/* 우측: 이미지 — 그리드 셀 가득 채움 (뷰포트 오른쪽 끝까지 도달) */}
        <SectionReveal
          delay={150}
          className="relative aspect-[4/5] md:aspect-auto md:min-h-[600px]"
        >
          <Image
            src="/about-us.png"
            alt="한국수산식품산업협회 — 수산식품 진열"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority={false}
          />
        </SectionReveal>
      </div>
    </section>
  );
}
