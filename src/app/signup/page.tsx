"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";

import {
  signupSchema,
  type SignupFormValues,
  FILE_ACCEPT_LABEL,
} from "@/lib/validation/signup";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { submitSignup } from "./actions";

// 단순 섹션 헤딩 — "— 01 / 계정 정보"
function SectionHeading({ no, title }: { no: string; title: string }) {
  return (
    <div className="border-b border-navy/10 pb-4">
      <p className="text-xs font-medium tracking-[0.3em] text-teal">— {no}</p>
      <h2 className="mt-2 text-lg font-semibold text-navy md:text-xl">
        {title}
      </h2>
    </div>
  );
}

export default function SignupPage() {
  // 제출 결과 — 성공 시 회사명 보관, 실패 시 에러 메시지 보관
  const [submitted, setSubmitted] = useState<{ companyName: string } | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      brn: "",
      password: "",
      passwordConfirm: "",
      companyName: "",
      corpRegNumber: "",
      ceoName: "",
      businessType: "",
      businessItem: "",
      companyEmail: "",
      contactName: "",
      contactRole: "",
      contactEmail: "",
      contactPhone: "",
      agreeTerms: false as unknown as true,
      agreePrivacy: false as unknown as true,
      agreeMarketing: false as unknown as true,
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setSubmitError(null);

    // FormData 직렬화 (Server Action에 파일 + 모든 필드 전달)
    const fd = new FormData();
    fd.set("brn", data.brn);
    fd.set("password", data.password);
    fd.set("passwordConfirm", data.passwordConfirm);
    fd.set("companyName", data.companyName);
    fd.set("corpRegNumber", data.corpRegNumber ?? "");
    fd.set("ceoName", data.ceoName);
    fd.set("businessType", data.businessType);
    fd.set("businessItem", data.businessItem);
    fd.set("companyEmail", data.companyEmail);
    fd.set("contactName", data.contactName);
    fd.set("contactRole", data.contactRole);
    fd.set("contactEmail", data.contactEmail);
    fd.set("contactPhone", data.contactPhone);
    fd.set("businessCert", data.businessCert);
    fd.set("agreeTerms", String(data.agreeTerms));
    fd.set("agreePrivacy", String(data.agreePrivacy));
    fd.set("agreeMarketing", String(data.agreeMarketing));

    const result = await submitSignup(fd);

    if (result.ok) {
      setSubmitted({ companyName: result.companyName });
    } else {
      setSubmitError(result.error);
      // 페이지 상단으로 스크롤해서 에러 메시지 보이게
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }

  // 제출 완료 화면
  if (submitted) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl px-6 py-32">
          <div className="rounded-md border border-mute/20 bg-white p-10 text-center md:p-14">
            <CheckCircle2 className="mx-auto h-14 w-14 text-teal" />
            <h1 className="mt-6 text-2xl font-bold text-navy md:text-3xl">
              가입 신청이 접수되었습니다
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-navy/70 md:text-base">
              <span className="font-medium text-navy">
                {submitted.companyName}
              </span>
              의 가입 신청이 정상 접수되었습니다.
              <br />
              관리자 검토 후 영업일 3일 이내에 가입 결과를 안내드립니다.
              <br />
              안내는 입력하신 회사 대표 이메일 또는 담당자 이메일로
              발송됩니다.
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-block rounded-md bg-teal px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-teal/90"
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
      <div className="mx-auto max-w-2xl px-6 pt-20 pb-10 text-center md:pt-28">
        <p className="eyebrow mb-4">MEMBERSHIP</p>
        <h1 className="text-3xl font-bold tracking-tight text-navy md:text-4xl">
          회원가입 신청
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-navy/70 md:text-base">
          회원가입은 관리자 검토 이후 영업일 3일 이내에 승인됩니다.
          <br />
          수산과 관련없는 사업자의 경우 가입 승인이 불가할 수 있습니다.
        </p>
      </div>

      {/* 폼 카드 */}
      <div className="mx-auto max-w-2xl px-6 pb-32">
        {/* 제출 실패 시 상단 에러 패널 */}
        {submitError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium">가입 신청 처리 중 오류가 발생했습니다</p>
              <p className="mt-1 text-destructive/85">{submitError}</p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-12 rounded-md border border-mute/20 bg-white p-6 md:p-12"
          >
            {/* 01 계정 정보 */}
            <section className="space-y-6">
              <SectionHeading no="01" title="계정 정보" />

              <FormField
                control={form.control}
                name="brn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      사업자등록번호 <span className="text-teal">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000-00-00000"
                        inputMode="numeric"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      로그인 시 아이디로 사용됩니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      비밀번호 <span className="text-teal">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="영문+숫자 포함 10자 이상"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      비밀번호 확인 <span className="text-teal">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {/* 02 회사 정보 */}
            <section className="space-y-6">
              <SectionHeading no="02" title="회사 정보" />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      법인명 <span className="text-teal">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="예: (주)한국수산식품" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="corpRegNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      법인등록번호{" "}
                      <span className="text-xs text-mute">(선택)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000000-0000000"
                        inputMode="numeric"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ceoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      대표자명 <span className="text-teal">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="예: 홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        업태 <span className="text-teal">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="예: 제조업" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessItem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        종목 <span className="text-teal">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="예: 수산물가공품"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      회사 대표 이메일 <span className="text-teal">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="예: contact@company.co.kr"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {/* 03 담당자 정보 */}
            <section className="space-y-6">
              <SectionHeading no="03" title="담당자 정보" />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        담당자 이름 <span className="text-teal">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="예: 김담당" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        직책 <span className="text-teal">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="예: 대리" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      담당자 이메일 <span className="text-teal">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="담당자 업무 이메일"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      담당자 휴대전화 <span className="text-teal">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="010-1234-5678"
                        inputMode="numeric"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {/* 04 증빙 자료 */}
            <section className="space-y-6">
              <SectionHeading no="04" title="증빙 자료" />

              <FormField
                control={form.control}
                name="businessCert"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>
                      사업자등록증 <span className="text-teal">*</span>
                    </FormLabel>
                    <FormControl>
                      <label
                        htmlFor="businessCert"
                        className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-dashed border-navy/30 bg-ivory/40 px-4 py-4 transition-colors hover:bg-ivory/70"
                      >
                        <div className="min-w-0 flex-1">
                          {value instanceof File ? (
                            <p className="truncate text-sm text-navy">
                              {value.name}{" "}
                              <span className="text-mute">
                                ({Math.round(value.size / 1024)}KB)
                              </span>
                            </p>
                          ) : (
                            <p className="text-sm text-navy/60">
                              파일을 선택하거나 끌어다 놓으세요
                            </p>
                          )}
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-navy px-3 py-1.5 text-xs font-medium text-white">
                          <Upload className="h-3.5 w-3.5" />
                          파일 선택
                        </span>
                        <input
                          {...field}
                          id="businessCert"
                          type="file"
                          accept={FILE_ACCEPT_LABEL}
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                        />
                      </label>
                    </FormControl>
                    <FormDescription>
                      PDF, JPG, PNG · 최대 5MB
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {/* 05 약관 동의 */}
            <section className="space-y-6">
              <SectionHeading no="05" title="약관 동의" />

              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex-1 leading-none">
                      <FormLabel className="text-sm font-normal text-navy">
                        <span className="text-teal">[필수]</span>{" "}
                        <Link
                          href="/terms"
                          className="underline-offset-2 hover:underline"
                          target="_blank"
                        >
                          이용약관
                        </Link>
                        에 동의합니다.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreePrivacy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex-1 leading-none">
                      <FormLabel className="text-sm font-normal text-navy">
                        <span className="text-teal">[필수]</span>{" "}
                        <Link
                          href="/privacy"
                          className="underline-offset-2 hover:underline"
                          target="_blank"
                        >
                          개인정보 수집·이용
                        </Link>
                        에 동의합니다.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeMarketing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex-1 leading-none">
                      <FormLabel className="text-sm font-normal text-navy">
                        <span className="text-teal">[필수]</span> 정책소식, 지원사업 소식 안내수신에 동의합니다.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </section>

            {/* 제출 */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full rounded-md bg-teal px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
              >
                {form.formState.isSubmitting ? "처리 중…" : "가입 신청하기"}
              </button>
              <p className="text-center text-xs text-mute">
                이미 회원이신가요?{" "}
                <Link
                  href="/login"
                  className="text-teal underline-offset-2 hover:underline"
                >
                  로그인
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
