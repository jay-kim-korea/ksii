"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation/login";

export type LoginResult = { ok: false; error: string };

// 사업자번호 → 합성 이메일 변환 (회원가입과 동일 규칙)
function brnToSyntheticEmail(brn: string): string {
  return `${brn.replace(/-/g, "")}@ksii.internal`;
}

export async function submitLogin(formData: FormData): Promise<LoginResult> {
  const identifier = String(formData.get("identifier") ?? "");
  const password = String(formData.get("password") ?? "");

  // 1) 검증
  const parsed = loginSchema.safeParse({ identifier, password });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  // 2) 식별자 → 이메일 변환 (이메일은 그대로, 사업자번호는 합성)
  const email = identifier.includes("@")
    ? identifier
    : brnToSyntheticEmail(identifier);

  // 3) Supabase Auth 로그인 (세션 쿠키는 SSR 클라이언트가 자동 설정)
  const supabase = await createClient();
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError || !signInData.user) {
    return {
      ok: false,
      error: "사업자번호/이메일 또는 비밀번호가 올바르지 않습니다.",
    };
  }

  // 4) 프로필에서 상태·역할 확인 (관리자는 status 무관, 회원은 approved만)
  const { data: profile, error: profileError } = await supabase
    .from("member_profiles")
    .select("status, role")
    .eq("id", signInData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return {
      ok: false,
      error:
        "계정 정보를 불러올 수 없습니다. 잠시 후 다시 시도하시거나 협회로 문의해주세요.",
    };
  }

  if (profile.role !== "admin") {
    if (profile.status === "pending") {
      await supabase.auth.signOut();
      return {
        ok: false,
        error:
          "가입 신청이 검토 중입니다. 영업일 3일 이내에 결과를 안내드립니다.",
      };
    }
    if (profile.status === "rejected") {
      await supabase.auth.signOut();
      return {
        ok: false,
        error:
          "가입 신청이 반려되었습니다. 자세한 사항은 협회로 문의해주세요.",
      };
    }
    if (profile.status !== "approved") {
      await supabase.auth.signOut();
      return {
        ok: false,
        error: "로그인할 수 없는 계정 상태입니다. 협회로 문의해주세요.",
      };
    }
  }

  // 5) 성공 — 역할별 리다이렉트
  // (redirect 는 throw 형태라 함수가 여기서 종료되어 클라이언트로 반환값 안 감)
  if (profile.role === "admin") {
    redirect("/admin");
  }
  redirect("/"); // 회원 영역 페이지는 후속 작업, 일단 홈으로
}
