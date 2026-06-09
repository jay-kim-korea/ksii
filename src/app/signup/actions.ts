"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { signupSchema } from "@/lib/validation/signup";

export type SignupResult =
  | { ok: true; companyName: string }
  | { ok: false; error: string };

// 사업자번호 → 합성 이메일 변환 규칙 (하이픈 제거 후 @ksii.internal 부착).
// 로그인 단계에서도 동일한 변환 규칙을 사용해야 함.
function brnToSyntheticEmail(brn: string): string {
  const digits = brn.replace(/-/g, "");
  return `${digits}@ksii.internal`;
}

export async function submitSignup(formData: FormData): Promise<SignupResult> {
  // ---------- 1) FormData → 객체화 ----------
  const file = formData.get("businessCert");
  if (!(file instanceof File)) {
    return { ok: false, error: "사업자등록증 파일이 첨부되지 않았습니다." };
  }

  const data = {
    brn: String(formData.get("brn") ?? ""),
    password: String(formData.get("password") ?? ""),
    passwordConfirm: String(formData.get("passwordConfirm") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    corpRegNumber: String(formData.get("corpRegNumber") ?? ""),
    ceoName: String(formData.get("ceoName") ?? ""),
    businessType: String(formData.get("businessType") ?? ""),
    businessItem: String(formData.get("businessItem") ?? ""),
    companyEmail: String(formData.get("companyEmail") ?? ""),
    contactName: String(formData.get("contactName") ?? ""),
    contactRole: String(formData.get("contactRole") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    contactPhone: String(formData.get("contactPhone") ?? ""),
    businessCert: file,
    agreeTerms: formData.get("agreeTerms") === "true",
    agreePrivacy: formData.get("agreePrivacy") === "true",
    agreeMarketing: formData.get("agreeMarketing") === "true",
  };

  // ---------- 2) zod 서버 재검증 (클라이언트 우회 방지) ----------
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: `입력값이 올바르지 않습니다: ${first.message}`,
    };
  }
  const validated = parsed.data;

  const admin = createAdminClient();
  const brnDigits = validated.brn.replace(/-/g, "");
  const syntheticEmail = brnToSyntheticEmail(validated.brn);
  const now = new Date().toISOString();

  // ---------- 3) 사업자번호 중복 확인 ----------
  const { data: existing, error: dupError } = await admin
    .from("member_profiles")
    .select("id")
    .eq("brn", brnDigits)
    .maybeSingle();

  if (dupError) {
    return {
      ok: false,
      error: `중복 확인 중 오류가 발생했습니다: ${dupError.message}`,
    };
  }
  if (existing) {
    return {
      ok: false,
      error:
        "이미 등록된 사업자등록번호입니다. 기존 계정으로 로그인하거나 협회로 문의해주세요.",
    };
  }

  // ---------- 4) Supabase Auth 계정 생성 ----------
  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email: syntheticEmail,
      password: validated.password,
      // 합성 이메일은 실제 발송 불가하므로 자동 확인 처리
      email_confirm: true,
    });

  if (authError || !authData.user) {
    return {
      ok: false,
      error: `계정 생성에 실패했습니다: ${authError?.message ?? "알 수 없는 오류"}`,
    };
  }

  const userId = authData.user.id;

  // ---------- 5) 사업자등록증 Storage 업로드 ----------
  const ext = validated.businessCert.name.split(".").pop()?.toLowerCase() || "bin";
  const filePath = `${userId}/cert.${ext}`;
  const fileBuffer = await validated.businessCert.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from("business-certificates")
    .upload(filePath, fileBuffer, {
      contentType: validated.businessCert.type,
      upsert: false,
    });

  if (uploadError) {
    // 롤백: 방금 만든 auth user 삭제
    await admin.auth.admin.deleteUser(userId);
    return {
      ok: false,
      error: `사업자등록증 업로드에 실패했습니다: ${uploadError.message}`,
    };
  }

  // ---------- 6) member_profiles INSERT ----------
  const { error: profileError } = await admin.from("member_profiles").insert({
    id: userId,
    brn: brnDigits,
    status: "pending",
    role: "member",
    company_name: validated.companyName,
    corp_reg_number: validated.corpRegNumber || null,
    ceo_name: validated.ceoName,
    business_type: validated.businessType,
    business_item: validated.businessItem,
    company_email: validated.companyEmail,
    contact_name: validated.contactName,
    contact_role: validated.contactRole,
    contact_email: validated.contactEmail,
    contact_phone: validated.contactPhone,
    business_cert_path: filePath,
    agree_terms_at: now,
    agree_privacy_at: now,
    agree_marketing_at: now,
  });

  if (profileError) {
    // 롤백: 업로드한 파일 삭제 + auth user 삭제
    await admin.storage.from("business-certificates").remove([filePath]);
    await admin.auth.admin.deleteUser(userId);
    return {
      ok: false,
      error: `프로필 저장에 실패했습니다: ${profileError.message}`,
    };
  }

  // ---------- 7) 성공 ----------
  return { ok: true, companyName: validated.companyName };
}
