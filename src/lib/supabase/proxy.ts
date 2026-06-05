import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 미들웨어에서 매 요청마다 Supabase 세션 쿠키를 갱신
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 중요: createServerClient와 supabase.auth.getUser() 사이에 코드를 추가하지 말 것.
  // 작은 실수도 사용자가 무작위로 로그아웃되는 등 디버깅이 매우 어려운 문제로 이어질 수 있음.
  // getUser()를 호출하여 토큰을 검증하고 세션을 갱신한다.
  await supabase.auth.getUser();

  return supabaseResponse;
}
