import { z } from "zod";
import { isValidBrn } from "./brn";

// 파일 업로드 사양 (확정값)
export const FILE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const FILE_ACCEPT = ["application/pdf", "image/jpeg", "image/png"];
export const FILE_ACCEPT_LABEL = ".pdf, .jpg, .png";

// File 객체 검증 (브라우저 환경에서만 동작)
const fileSchema = z
  .custom<File>((v) => v instanceof File, "사업자등록증 파일을 첨부해주세요.")
  .refine((f) => FILE_ACCEPT.includes(f.type), {
    message: "PDF, JPG, PNG 파일만 업로드할 수 있습니다.",
  })
  .refine((f) => f.size <= FILE_MAX_BYTES, {
    message: "파일 용량은 5MB 이하여야 합니다.",
  });

export const signupSchema = z
  .object({
    // 계정 정보
    brn: z
      .string()
      .min(1, "사업자등록번호를 입력해주세요.")
      .refine(isValidBrn, "올바른 사업자등록번호 형식이 아닙니다."),
    password: z
      .string()
      .min(10, "비밀번호는 10자 이상이어야 합니다.")
      .regex(/[A-Za-z]/, "영문을 포함해야 합니다.")
      .regex(/\d/, "숫자를 포함해야 합니다."),
    passwordConfirm: z.string().min(1, "비밀번호를 한 번 더 입력해주세요."),

    // 회사 정보
    companyName: z.string().min(1, "법인명을 입력해주세요."),
    corpRegNumber: z
      .string()
      .optional()
      .refine(
        (v) => !v || /^\d{6}-?\d{7}$/.test(v.replace(/\s/g, "")),
        "법인등록번호는 13자리 숫자(XXXXXX-XXXXXXX)여야 합니다.",
      ),
    ceoName: z.string().min(1, "대표자명을 입력해주세요."),
    businessType: z.string().min(1, "업태를 입력해주세요."),
    businessItem: z.string().min(1, "종목을 입력해주세요."),
    companyEmail: z
      .string()
      .min(1, "회사 대표 이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다."),

    // 담당자 정보
    contactName: z.string().min(1, "담당자 이름을 입력해주세요."),
    contactRole: z.string().min(1, "담당자 직책을 입력해주세요."),
    contactEmail: z
      .string()
      .min(1, "담당자 이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다."),
    contactPhone: z
      .string()
      .min(1, "담당자 휴대전화를 입력해주세요.")
      .regex(
        /^01[0-9]-?\d{3,4}-?\d{4}$/,
        "올바른 휴대전화 형식이 아닙니다. (예: 010-1234-5678)",
      ),

    // 증빙
    businessCert: fileSchema,

    // 약관
    agreeTerms: z.literal(true, {
      message: "이용약관에 동의해주세요.",
    }),
    agreePrivacy: z.literal(true, {
      message: "개인정보 수집·이용에 동의해주세요.",
    }),
    agreeMarketing: z.literal(true, {
      message: "정책소식·지원사업 소식 수신에 동의해주세요.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
