"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  ChevronDown,
  Download,
  FileText,
  X,
} from "lucide-react";

import {
  approveApplication,
  rejectApplication,
  getCertSignedUrl,
} from "../actions";
import { formatBrn, formatDateKR } from "@/lib/format";

export type Application = {
  id: string;
  brn: string;
  status: "pending" | "approved" | "rejected";
  company_name: string;
  corp_reg_number: string | null;
  ceo_name: string;
  business_type: string;
  business_item: string;
  company_email: string;
  contact_name: string;
  contact_role: string;
  contact_email: string;
  contact_phone: string;
  business_cert_path: string | null;
  rejected_reason: string | null;
  created_at: string;
};

export const TABLE_COLSPAN = 7;

const STATUS_BADGE: Record<
  Application["status"],
  { label: string; className: string }
> = {
  pending: { label: "검토 대기", className: "bg-teal/10 text-teal" },
  approved: { label: "승인 완료", className: "bg-green-100 text-green-700" },
  rejected: { label: "반려", className: "bg-rose-100 text-rose-700" },
};

export function ApplicationRow({ app }: { app: Application }) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  function onApprove() {
    setActionError(null);
    if (!confirm(`${app.company_name} 의 가입 신청을 승인하시겠습니까?`)) return;
    startTransition(async () => {
      const result = await approveApplication(app.id);
      if (!result.ok) setActionError(result.error);
    });
  }

  function onReject(e: React.FormEvent) {
    e.preventDefault();
    setActionError(null);
    startTransition(async () => {
      const result = await rejectApplication(app.id, rejectReason);
      if (!result.ok) {
        setActionError(result.error);
      } else {
        setShowRejectForm(false);
        setRejectReason("");
      }
    });
  }

  async function onDownloadCert() {
    if (!app.business_cert_path) return;
    setActionError(null);
    const result = await getCertSignedUrl(app.business_cert_path);
    if ("error" in result) {
      setActionError(result.error);
      return;
    }
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  const badge = STATUS_BADGE[app.status];

  return (
    <>
      {/* 메인 행 */}
      <tr
        onClick={() => setExpanded((v) => !v)}
        className={
          "cursor-pointer border-b border-navy/5 transition-colors " +
          (expanded ? "bg-ivory/40" : "hover:bg-ivory/25")
        }
      >
        <td className="px-4 py-4">
          <span
            className={
              "inline-block rounded-md px-2 py-0.5 text-xs font-medium " +
              badge.className
            }
          >
            {badge.label}
          </span>
        </td>
        <td className="px-4 py-4 text-sm font-semibold text-navy">
          {app.company_name}
        </td>
        <td className="px-4 py-4 font-mono text-sm tabular-nums text-navy/80">
          {formatBrn(app.brn)}
        </td>
        <td className="px-4 py-4 text-sm text-navy/80">{app.ceo_name}</td>
        <td className="px-4 py-4 text-sm text-navy/80">
          {app.contact_name}{" "}
          <span className="text-xs text-mute">({app.contact_role})</span>
        </td>
        <td className="px-4 py-4 text-xs text-mute">
          {formatDateKR(app.created_at)}
        </td>
        <td className="px-4 py-4">
          <ChevronDown
            aria-label={expanded ? "접기" : "펼치기"}
            className={
              "h-4 w-4 text-navy/40 transition-transform " +
              (expanded ? "rotate-180" : "")
            }
          />
        </td>
      </tr>

      {/* 펼쳤을 때 상세 영역 */}
      {expanded && (
        <tr className="border-b border-navy/10 bg-ivory/30">
          <td colSpan={TABLE_COLSPAN} className="p-6">
            <div className="space-y-5">
              {/* 추가 정보 그리드 */}
              <dl className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm md:grid-cols-3">
                <Field
                  label="법인등록번호"
                  value={app.corp_reg_number ?? "—"}
                  mono
                />
                <Field label="업태" value={app.business_type} />
                <Field label="종목" value={app.business_item} />
                <Field label="회사 대표 이메일" value={app.company_email} />
                <Field label="담당자 이메일" value={app.contact_email} />
                <Field label="담당자 휴대전화" value={app.contact_phone} />
              </dl>

              {/* 반려 사유 (있을 때만) */}
              {app.status === "rejected" && app.rejected_reason && (
                <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs leading-relaxed text-rose-800">
                  <p className="font-medium">반려 사유</p>
                  <p className="mt-1">{app.rejected_reason}</p>
                </div>
              )}

              {/* 에러 패널 */}
              {actionError && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* 액션 행 */}
              <div className="flex flex-wrap items-center gap-3 border-t border-navy/10 pt-4">
                {app.business_cert_path && (
                  <button
                    type="button"
                    onClick={onDownloadCert}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-md border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-navy/5 disabled:opacity-50"
                  >
                    <FileText className="h-4 w-4" />
                    사업자등록증 보기
                    <Download className="h-3.5 w-3.5 text-mute" />
                  </button>
                )}

                {app.status === "pending" && (
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectForm((v) => !v)}
                      disabled={isPending}
                      className="rounded-md border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-50"
                    >
                      반려
                    </button>
                    <button
                      type="button"
                      onClick={onApprove}
                      disabled={isPending}
                      className="rounded-md bg-teal px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
                    >
                      승인
                    </button>
                  </div>
                )}
              </div>

              {/* 반려 사유 입력 폼 */}
              {showRejectForm && (
                <form
                  onSubmit={onReject}
                  className="rounded-md border border-rose-200 bg-rose-50/60 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <label
                      htmlFor={`reject-reason-${app.id}`}
                      className="text-sm font-medium text-rose-900"
                    >
                      반려 사유
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      className="text-rose-700 hover:text-rose-900"
                      aria-label="닫기"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    id={`reject-reason-${app.id}`}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    required
                    placeholder="반려 사유를 입력해주세요. 신청자에게 전달됩니다."
                    className="w-full resize-none rounded-md border border-rose-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-mute focus:border-rose-400 focus:outline-none"
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-navy/70 hover:text-navy"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isPending || !rejectReason.trim()}
                      className="rounded-md bg-rose-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                    >
                      반려 처리
                    </button>
                  </div>
                </form>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-mute">{label}</dt>
      <dd
        className={
          "text-sm text-navy " + (mono ? "font-mono tabular-nums" : "")
        }
      >
        {value}
      </dd>
    </div>
  );
}
