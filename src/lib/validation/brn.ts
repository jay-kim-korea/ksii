// 사업자등록번호 체크섬 — 10자리 한국 사업자번호 표준 알고리즘
// 하이픈 유무 모두 허용. 외부에 노출되는 공용 검증 유틸.
export function isValidBrn(value: string): boolean {
  const digits = value.replace(/-/g, "");
  if (digits.length !== 10 || !/^\d{10}$/.test(digits)) return false;

  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += Number(digits[i]) * weights[i];
  }
  sum += Math.floor((Number(digits[8]) * 5) / 10);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(digits[9]);
}
