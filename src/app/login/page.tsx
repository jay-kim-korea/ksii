"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";

import { loginSchema, type LoginFormValues } from "@/lib/validation/login";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  // Phase 1 — 검증 통과 여부만 표시 (실제 인증 X)
  const [submittedBrn, setSubmittedBrn] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { brn: "", password: "" },
  });

  function onSubmit(data: LoginFormValues) {
    // 비밀번호는 로그에 노출하지 않음
    console.log("[LOGIN/Phase1] 검증 통과:", {
      brn: data.brn,
      password: "[REDACTED]",
    });
    setSubmittedBrn(data.brn);
  }

  if (submittedBrn) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-md px-6 py-32">
          <div className="rounded-md border border-mute/20 bg-white p-10 text-center md:p-14">
            <CheckCircle2 className="mx-auto h-14 w-14 text-teal" />
            <h1 className="mt-6 text-2xl font-bold text-navy md:text-3xl">
              입력 검증 완료
            </h1>
            <p className="mt-4 text-sm text-navy/70 md:text-base">
              사업자등록번호{" "}
              <span className="font-medium text-navy">{submittedBrn}</span>
              로 로그인 시도.
              <br />
              실제 인증 처리는 다음 단계(Phase 3)에서 연결됩니다.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  form.reset();
                  setSubmittedBrn(null);
                }}
                className="rounded-md border border-navy/20 px-6 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
              >
                다시 입력하기
              </button>
              <Link
                href="/"
                className="rounded-md bg-teal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal/90"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* 상단 헤더 영역 */}
      <div className="mx-auto max-w-md px-6 pt-20 pb-10 text-center md:pt-28">
        <p className="eyebrow mb-4">MEMBER SIGN-IN</p>
        <h1 className="text-3xl font-bold tracking-tight text-navy md:text-4xl">
          로그인
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-navy/70 md:text-base">
          회원가입 후 관리자 승인이 완료된 회원사만 로그인할 수 있습니다.
        </p>
      </div>

      {/* 폼 카드 */}
      <div className="mx-auto max-w-md px-6 pb-32">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-6 rounded-md border border-mute/20 bg-white p-6 md:p-10"
          >
            <FormField
              control={form.control}
              name="brn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사업자등록번호</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000-00-00000"
                      inputMode="numeric"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력해주세요"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full rounded-md bg-teal px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
            >
              로그인
            </button>

            {/* 하단 보조 링크 */}
            <div className="space-y-3 border-t border-navy/10 pt-6 text-center">
              <p className="text-xs text-mute">
                아직 회원이 아니신가요?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-teal underline-offset-2 hover:underline"
                >
                  회원가입
                </Link>
              </p>
              <p className="text-xs text-mute">
                비밀번호를 잊으셨나요?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-teal underline-offset-2 hover:underline"
                >
                  협회로 문의
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
