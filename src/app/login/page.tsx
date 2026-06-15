"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";

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
import { submitLogin } from "./actions";

export default function LoginPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { identifier: "", password: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    setSubmitError(null);

    const fd = new FormData();
    fd.set("identifier", data.identifier);
    fd.set("password", data.password);

    // 성공 시 서버에서 redirect되어 이 코드는 도달하지 않음.
    // 실패 시에만 result 반환.
    const result = await submitLogin(fd);
    if (result && !result.ok) {
      setSubmitError(result.error);
    }
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
        {/* 제출 실패 시 상단 에러 패널 */}
        {submitError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p>{submitError}</p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-6 rounded-md border border-mute/20 bg-white p-6 md:p-10"
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사업자등록번호 또는 이메일</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000-00-00000 또는 admin@example.com"
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
              {form.formState.isSubmitting ? "로그인 중…" : "로그인"}
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
