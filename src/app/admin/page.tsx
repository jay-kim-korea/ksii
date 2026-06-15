import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ApplicationRow,
  TABLE_COLSPAN,
  type Application,
} from "./_components/ApplicationRow";

export const dynamic = "force-dynamic"; // 항상 최신 상태 반영

// 로컬 개발 환경에서만 인증 우회 (layout과 동일 기준)
const IS_DEV_BYPASS = process.env.NODE_ENV === "development";

type StatusTab = "pending" | "approved" | "rejected" | "all";

const TAB_LABELS: Record<StatusTab, string> = {
  pending: "검토 대기",
  approved: "승인 완료",
  rejected: "반려",
  all: "전체",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status: StatusTab =
    params.status === "approved" ||
    params.status === "rejected" ||
    params.status === "all"
      ? params.status
      : "pending";

  // 우회 모드는 로그인된 admin이 없으므로 RLS 우회용 admin client 사용.
  // 프로덕션에서는 user-session client + is_admin() RLS 정책으로 권한 확인.
  const supabase = IS_DEV_BYPASS ? createAdminClient() : await createClient();

  let query = supabase
    .from("member_profiles")
    .select("*")
    .eq("role", "member")
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data: applications, error } = await query;

  // 탭 카운트 (전체 상태별 집계)
  const { data: counts } = await supabase
    .from("member_profiles")
    .select("status")
    .eq("role", "member");

  const countByStatus = {
    pending: counts?.filter((c) => c.status === "pending").length ?? 0,
    approved: counts?.filter((c) => c.status === "approved").length ?? 0,
    rejected: counts?.filter((c) => c.status === "rejected").length ?? 0,
    all: counts?.length ?? 0,
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <p className="eyebrow mb-3">ADMIN</p>
        <h1 className="text-3xl font-bold tracking-tight text-navy md:text-4xl">
          회원 가입 신청 관리
        </h1>
        <p className="mt-4 text-sm text-navy/70">
          회원사 가입 신청을 검토하고 승인 또는 반려 처리할 수 있습니다.
        </p>
      </header>

      {/* 상태 필터 탭 */}
      <nav className="mb-8 flex flex-wrap gap-2 border-b border-navy/10">
        {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
          <a
            key={tab}
            href={`/admin?status=${tab}`}
            className={
              "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors " +
              (status === tab
                ? "border-teal text-teal"
                : "border-transparent text-navy/60 hover:text-navy")
            }
          >
            {TAB_LABELS[tab]}{" "}
            <span className="ml-1 text-xs text-mute">
              ({countByStatus[tab]})
            </span>
          </a>
        ))}
      </nav>

      {/* 에러 / 빈 상태 / 표 */}
      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          신청 목록을 불러올 수 없습니다: {error.message}
        </div>
      ) : !applications || applications.length === 0 ? (
        <div className="rounded-md border border-dashed border-mute/30 bg-ivory/30 p-12 text-center text-sm text-navy/60">
          {TAB_LABELS[status]} 상태의 신청이 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-mute/20 bg-white">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-navy/15 bg-ivory/30 text-xs uppercase tracking-wider text-navy/60">
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">법인명</th>
                <th className="px-4 py-3 font-medium">사업자번호</th>
                <th className="px-4 py-3 font-medium">대표자</th>
                <th className="px-4 py-3 font-medium">담당자</th>
                <th className="px-4 py-3 font-medium">신청일</th>
                <th className="px-4 py-3" aria-label="펼치기" />
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <ApplicationRow key={app.id} app={app as Application} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
