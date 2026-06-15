import { z } from "zod";
import { isValidBrn } from "./brn";

// 로그인 ID는 사업자등록번호(회원) 또는 이메일(관리자) 둘 다 허용.
// 서버에서 형식 보고 분기 — '@' 포함 시 이메일, 아니면 사업자번호로 처리.
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "사업자등록번호 또는 이메일을 입력해주세요.")
    .refine(
      (v) => v.includes("@") || isValidBrn(v),
      "올바른 사업자등록번호 또는 이메일 형식이 아닙니다.",
    ),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
