// 서버 전용 admin 클라이언트.
// service_role / secret key 를 사용하므로 RLS 우회 가능.
// 절대 클라이언트 컴포넌트·브라우저에서 import 하지 말 것.
// "server-only" import 가 클라이언트 import 시 빌드 에러 발생시킴.
import "server-only";

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        // admin 작업용 — 세션 유지 불필요
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
