import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

type FeatureProps = {
  id?: string;
  no: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: "left" | "right";
};

// About와 동일한 풀폭 2컬럼 레이아웃을 좌우 위치만 바꿔 재사용하는 단일 사업 섹션
function BusinessFeature({
  id,
  no,
  title,
  body,
  imageSrc,
  imageAlt,
  imageSide,
}: FeatureProps) {
  const isImageLeft = imageSide === "left";

  return (
    <section id={id} className="relative bg-navy text-white">
      <div className="grid md:grid-cols-2">
        {/* 텍스트 컬럼 — imageSide에 따라 좌/우 위치와 정렬 반전 */}
        <div
          className={
            "flex items-center px-6 py-16 md:py-0 " +
            (isImageLeft
              ? "md:order-last md:pl-8 md:pr-10 lg:pl-12 lg:pr-16 xl:pr-24"
              : "md:pl-10 md:pr-8 lg:pl-16 lg:pr-12 xl:pl-24")
          }
        >
          <SectionReveal>
            <div
              className={
                "max-w-xl " + (isImageLeft ? "md:mr-auto" : "md:ml-auto")
              }
            >
              <p className="eyebrow mb-6">WHAT WE DO</p>
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-xs font-medium tracking-[0.3em] text-teal">
                  — {no}
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                {title}
              </h2>
              <p className="mt-8 text-base leading-relaxed text-white/70 md:text-lg">
                {body}
              </p>
              <a
                href="/business"
                className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-teal transition-all hover:gap-3"
              >
                자세히 보기
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </SectionReveal>
        </div>

        {/* 이미지 컬럼 — 원본 색감 유지 */}
        <SectionReveal
          delay={150}
          className={
            "relative aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[600px] " +
            (isImageLeft ? "md:order-first" : "")
          }
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </SectionReveal>
      </div>
    </section>
  );
}

const programs = [
  {
    no: "01",
    title: "보조금·지원사업 정보",
    body: "정부와 지자체의 수산식품 산업 보조금·지원사업 정보를 회원사에게 가장 빠르게, 가장 자세히 안내합니다. 신청 자격과 일정, 필요 서류까지 한 곳에서 확인할 수 있습니다.",
    imageSrc: "/business-subsidy.png",
    imageAlt: "보조금·지원사업 정보 — 수산식품 산업 지원 안내",
  },
  {
    no: "02",
    title: "회원 네트워킹",
    body: "수산식품 업계 회원사 간의 협력, 정보 교류, 공동 사업 기회를 연결합니다. 정기 세미나와 간담회를 통해 산업 내 인적·사업 네트워크를 함께 확장합니다.",
    imageSrc: "/business-networking.png",
    imageAlt: "회원 네트워킹 — 수산식품 업계 협력과 교류",
  },
  {
    no: "03",
    title: "정책·시장 동향",
    body: "국내외 정책 변화와 시장 트렌드를 정기적으로 분석해 회원사에 공유합니다. 한 발 앞서 산업의 흐름을 파악하고, 협회 차원의 정책 제언에 함께 참여하세요.",
    imageSrc: "/business-policy.png",
    imageAlt: "정책·시장 동향 — 수산식품 산업 정책 및 시장 분석",
  },
];

// About 섹션 뒤에 이어지는 3개의 WHAT WE DO 섹션.
// About은 이미지 우측이므로 첫 사업 섹션부터 좌/우/좌 순서로 교차 배치.
export function BusinessSection() {
  return (
    <>
      {programs.map((p, i) => (
        <BusinessFeature
          key={p.no}
          id={i === 0 ? "business" : undefined}
          no={p.no}
          title={p.title}
          body={p.body}
          imageSrc={p.imageSrc}
          imageAlt={p.imageAlt}
          imageSide={i % 2 === 0 ? "left" : "right"}
        />
      ))}
    </>
  );
}
