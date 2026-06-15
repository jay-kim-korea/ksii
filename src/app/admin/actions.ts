"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

// 로컬 개발 환경에서만 인증 우회 (layout과 동일 기준)
const IS_DEV_BYPASS = process.env.NODE_ENV === "development";

// 호출자가 관리자인지 확인 (호출 시 매번 검증).
// 우회 모드에서는 adminId 를 null 로 반환 (DB 의 approved_by 가 nullable 이라 OK).
async function ensureAdmin(): Promise<
  { ok: true; adminId: string | null } | { ok: false; error: string }
> {
  if (IS_DEV_BYPASS) {
    return { ok: true, adminId: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { data: profile } = await supabase
    .from("member_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { ok: false, error: "관리자 권한이 필요합니다." };
  }

  return { ok: true, adminId: user.id };
}

// 가입 신청 승인
export async function approveApplication(
  memberId: string,
): Promise<ActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth;

  const admin = createAdminClient();
  const { error } = await admin
    .from("member_profiles")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: auth.adminId,
      rejected_reason: null,
    })
    .eq("id", memberId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}

// 가입 신청 반려 (사유 필수)
export async function rejectApplication(
  memberId: string,
  reason: string,
): Promise<ActionResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) return auth;

  const trimmed = reason.trim();
  if (!trimmed) {
    return { ok: false, error: "반려 사유를 입력해주세요." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("member_profiles")
    .update({
      status: "rejected",
      rejected_reason: trimmed,
      approved_at: null,
      approved_by: null,
    })
    .eq("id", memberId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}

// 사업자등록증 임시 signed URL 발급 (60초 유효)
export async function getCertSignedUrl(
  filePath: string,
): Promise<{ url: string } | { error: string }> {
  const auth = await ensureAdmin();
  if (!auth.ok) return { error: auth.error };

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("business-certificates")
    .createSignedUrl(filePath, 60);

  if (error || !data) {
    return { error: error?.message ?? "파일 URL 생성에 실패했습니다." };
  }

  return { url: data.signedUrl };
}
