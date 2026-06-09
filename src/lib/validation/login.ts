import { z } from "zod";
import { isValidBrn } from "./brn";

export const loginSchema = z.object({
  brn: z
    .string()
    .min(1, "사업자등록번호를 입력해주세요.")
    .refine(isValidBrn, "올바른 사업자등록번호 형식이 아닙니다."),
  // 로그인은 단순 비어있지 않음만 확인 (강도 규칙은 회원가입 시점에만 적용).
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
