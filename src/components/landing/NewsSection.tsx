import { ArrowRight } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

const items = [
  {
    date: "2026.05.10",
    category: "공지",
    title: "2026년 상반기 정기총회 개최 안내",
    excerpt:
      "협회 회원사 여러분을 모시고 상반기 정기총회를 개최합니다. 주요 안건과 일정을 안내드립니다.",
  },
  {
    date: "2026.05.02",
    category: "보조금",
    title: "수산식품 가공시설 현대화 지원사업 공고",
    excerpt:
      "해양수산부 수산식품 가공시설 현대화 지원사업이 공고되었습니다. 신청 자격과 일정을 확인하세요.",
  },
  {
    date: "2026.04.24",
    category: "정책",
    title: "수출 활성화를 위한 정책 간담회 결과",
    excerpt:
      "회원사와 함께 진행한 수출 활성화 정책 간담회의 주요 논의 사항과 후속 계획을 공유합니다.",
  },
];

export function NewsSection() {
  return (
    <section id="news" className="bg-white py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-6">NEWSROOM</p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-navy md:text-5xl">
                최신 소식과 공지
              </h2>
            </div>
            <a
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal transition-all hover:gap-3"
            >
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </SectionReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {items.map((item, i) => (
            <SectionReveal key={item.title} delay={i * 120}>
              <a
                href="/news"
                className="group block h-full border-t border-navy/15 pt-6 transition-colors hover:border-teal"
              >
                <div className="flex items-center gap-3 text-xs text-mute">
                  <span className="font-medium text-teal">{item.category}</span>
                  <span className="h-3 w-px bg-navy/20" />
                  <time>{item.date}</time>
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-snug text-navy transition-colors group-hover:text-teal md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-navy/60">
                  {item.excerpt}
                </p>
              </a>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
