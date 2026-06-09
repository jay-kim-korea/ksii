-- =====================================================
-- Phase 2: 회원 프로필 테이블 + RLS + Storage 정책
-- =====================================================
-- 이 파일은 Supabase 대시보드의 SQL Editor에 한 번에 붙여넣어 실행하세요.
-- 버전 관리/재현 목적으로 repo에 보관.
-- =====================================================

-- ----------------------------------------------------------------
-- 1) member_profiles 테이블
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.member_profiles (
  id                    uuid PRIMARY KEY
                          REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 계정 식별자 (사업자번호 = 로그인 ID 원본)
  brn                   text UNIQUE,

  -- 상태 / 역할
  status                text NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'approved', 'rejected')),
  role                  text NOT NULL DEFAULT 'member'
                          CHECK (role IN ('member', 'admin')),

  -- 회사 정보 (member에게는 필수, admin은 nullable)
  company_name          text,
  corp_reg_number       text,
  ceo_name              text,
  business_type         text,
  business_item         text,
  company_email         text,

  -- 담당자 정보
  contact_name          text,
  contact_role          text,
  contact_email         text,
  contact_phone         text,

  -- 증빙 자료 (Storage 내부 경로 — 예: "{uuid}/cert.pdf")
  business_cert_path    text,

  -- 약관 동의 시점
  agree_terms_at        timestamptz,
  agree_privacy_at      timestamptz,
  agree_marketing_at    timestamptz,

  -- 관리자 메타
  rejected_reason       text,
  approved_at           timestamptz,
  approved_by           uuid REFERENCES auth.users(id),

  -- 표준 타임스탬프
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),

  -- role=member 인 경우 회사·담당자 정보 필수
  CONSTRAINT member_required_fields CHECK (
    role = 'admin' OR (
      brn IS NOT NULL
      AND company_name IS NOT NULL
      AND ceo_name IS NOT NULL
      AND business_type IS NOT NULL
      AND business_item IS NOT NULL
      AND company_email IS NOT NULL
      AND contact_name IS NOT NULL
      AND contact_role IS NOT NULL
      AND contact_email IS NOT NULL
      AND contact_phone IS NOT NULL
    )
  )
);

-- ----------------------------------------------------------------
-- 2) 인덱스 (자주 쓰는 조회 기준)
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS member_profiles_status_idx
  ON public.member_profiles (status);
CREATE INDEX IF NOT EXISTS member_profiles_role_idx
  ON public.member_profiles (role);
CREATE INDEX IF NOT EXISTS member_profiles_created_at_idx
  ON public.member_profiles (created_at DESC);

-- ----------------------------------------------------------------
-- 3) updated_at 자동 갱신 트리거
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS member_profiles_set_updated_at ON public.member_profiles;
CREATE TRIGGER member_profiles_set_updated_at
  BEFORE UPDATE ON public.member_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------
-- 4) 관리자 여부 헬퍼 — SECURITY DEFINER 로 RLS 무한 재귀 방지
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.member_profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- ----------------------------------------------------------------
-- 5) RLS 활성화
-- ----------------------------------------------------------------
ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- 6) RLS 정책 — 회원 / 관리자
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "members can read own profile"   ON public.member_profiles;
DROP POLICY IF EXISTS "admins can read all profiles"   ON public.member_profiles;
DROP POLICY IF EXISTS "admins can update any profile"  ON public.member_profiles;

-- SELECT: 본인 프로필
CREATE POLICY "members can read own profile"
  ON public.member_profiles FOR SELECT
  USING (auth.uid() = id);

-- SELECT: 관리자는 전체
CREATE POLICY "admins can read all profiles"
  ON public.member_profiles FOR SELECT
  USING (public.is_admin());

-- UPDATE: 관리자만 (회원 자기 정보 수정은 후속 작업에서 별도 정책)
CREATE POLICY "admins can update any profile"
  ON public.member_profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- INSERT / DELETE: 정책 없음 → service_role 만 수행 가능 (Phase 3 서버 액션)

-- ----------------------------------------------------------------
-- 7) Storage 버킷 정책
--    버킷 자체는 대시보드 UI 에서 먼저 생성해야 합니다.
--    (Storage → New bucket → name: business-certificates, Public: No)
--    아래는 버킷 생성 후 적용할 정책.
-- ----------------------------------------------------------------
DROP POLICY IF EXISTS "members can read own cert"   ON storage.objects;
DROP POLICY IF EXISTS "admins can read any cert"    ON storage.objects;

-- 파일 경로 컨벤션: business-certificates/{user_id}/cert.{ext}
-- storage.foldername(name)[1] = '{user_id}'
CREATE POLICY "members can read own cert"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'business-certificates'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "admins can read any cert"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'business-certificates'
    AND public.is_admin()
  );

-- INSERT / UPDATE / DELETE 는 service_role 만 (Phase 3 서버 액션)
