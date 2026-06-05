# 한국수산식품산업협회 회원 사이트 (KSII)

## 프로젝트 개요
- **이름**: 한국수산식품산업협회 회원제 보조금 정보 플랫폼
- **목적**: 협회 회원사에게 수산식품 산업 관련 보조금/지원사업 정보를 제공하는 회원제 웹사이트
- **대상 사용자**: 협회 회원사 담당자 (한국어 사용자)
- **분위기**: **미래지향적·활기 있는 모던 코퍼레이트 톤 (그린랩스 스타일)**. 협회지만 관(官)적·보수적 느낌은 줄이고, 큰 섹션·풀블리드 비주얼·스크롤 페이드인 모션·teal 액센트를 적극 활용한 동적 인상.

## 기술 스택
- **프레임워크**: Next.js (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **백엔드 / DB / 인증**: Supabase (Auth, Postgres, RLS, Storage)
- **배포**: Vercel
- **패키지 매니저**: npm

## 폴더 구조 (예정)
```
src/
  app/              # App Router 라우트
  components/       # 재사용 UI 컴포넌트
  lib/
    supabase/       # Supabase 클라이언트 (client/server/proxy)
  proxy.ts          # Next.js Proxy 엔트리 (Next.js 16+에서 구 middleware.ts 대체)
```

## 코드 컨벤션
- **컴포넌트**: PascalCase (예: `MemberCard.tsx`, `SubsidyList.tsx`)
- **함수 / 변수**: camelCase (예: `fetchSubsidies`, `currentUser`)
- **상수**: UPPER_SNAKE_CASE
- **파일명**:
  - 컴포넌트 파일은 PascalCase
  - 그 외 유틸/라우트 파일은 kebab-case 또는 Next.js 컨벤션 (`page.tsx`, `layout.tsx`)
- **주석**: 한글 OK. WHY를 설명할 때만 작성, WHAT은 코드로 표현.
- **Import alias**: `@/*` → `src/*`

## 언어 / 톤
- **UI 텍스트**: 한국어 우선
- **에러 메시지 / 사용자 피드백**: 정중한 존댓말
- **응답 스타일 (Claude → 사용자)**:
  - 한글로 답변
  - 작업 시작 전 **항상 계획을 먼저 보여주고 사용자 확인을 받은 뒤** 실행
  - 단계가 여러 개면 각 단계 종료 시 결과를 보여주고 멈추기

## Supabase 사용 원칙
- `@supabase/ssr` 사용 (공식 권장 패턴)
- 클라이언트는 용도별로 분리:
  - `src/lib/supabase/client.ts` — 브라우저용
  - `src/lib/supabase/server.ts` — 서버 컴포넌트 / Route Handler용
  - `src/lib/supabase/proxy.ts` — Proxy 세션 갱신용 (Next.js 16+ 명칭, 구 middleware)
- 환경변수는 `.env.local`로 관리, 공개 예시는 `.env.local.example`로 커밋
- RLS(Row Level Security)는 기본 활성화 가정

## 보안 / 개인정보
- 회원 정보, 사업자번호 등 민감 정보는 RLS로 접근 제어
- 서비스 롤 키는 절대 클라이언트에 노출 금지 (서버 전용)
- `.env.local`은 커밋 금지

## 작업 흐름 (Claude 행동 규칙)
1. 사용자 요청을 받으면 **먼저 계획을 한글로 제시**
2. 사용자가 확인하면 실행
3. 큰 작업은 단계별로 끊어서 진행, 각 단계 종료 시 결과 보고 후 대기
4. 파괴적 작업(파일 삭제, git 강제 푸시 등)은 반드시 사전 확인
5. 정부/협회 톤에 맞지 않는 캐주얼한 카피·이모지 사용 자제
