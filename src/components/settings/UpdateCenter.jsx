import {
  CheckCircle2,
  Download,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

import {
  useEffect,
  useRef,
  useState
} from 'react';

function UpdateStatusBox({
  children,
  type = 'normal'
}) {
  const style =
    type === 'error'
      ? {
          background:
            'var(--danger-soft)',
          color:
            'var(--danger)',
          borderColor:
            'var(--danger)'
        }
      : type ===
        'success'
        ? {
            background:
              'var(--accent-soft)',
            color:
              'var(--accent)',
            borderColor:
              'var(--accent)'
          }
        : {
            background:
              'var(--bg-secondary)',
            color:
              'var(--text-secondary)',
            borderColor:
              'var(--border)'
          };

  return (
    <div
      className="rounded-xl border px-3 py-2.5 text-[10px] font-bold"
      style={style}
    >
      {children}
    </div>
  );
}

export default function UpdateCenter() {
  const [
    status,
    setStatus
  ] = useState(
    'idle'
  );

  const [
    info,
    setInfo
  ] = useState(null);

  const [
    progress,
    setProgress
  ] = useState(0);

  const [
    message,
    setMessage
  ] = useState('');

  const autoChecked =
    useRef(false);

  const check =
    async (
      silent = false
    ) => {
      if (
        !window.desktopAPI
          ?.checkForUpdates
      ) {
        if (!silent) {
          setStatus(
            'error'
          );

          setMessage(
            'خدمة التحديث غير متاحة في هذه النسخة.'
          );
        }

        return;
      }

      if (!silent) {
        setStatus(
          'checking'
        );
      }

      setMessage('');

      try {
        const result =
          await window.desktopAPI
            .checkForUpdates();

        if (
          !result?.success
        ) {
          if (!silent) {
            setStatus(
              'error'
            );

            setMessage(
              result?.message ||
              'تعذر التحقق من وجود تحديث.'
            );
          }

          return;
        }

        setInfo(
          result
        );

        if (
          result.updateAvailable
        ) {
          setStatus(
            'available'
          );
        } else if (
          !silent
        ) {
          setStatus(
            'latest'
          );
        }
      } catch (
        error
      ) {
        if (!silent) {
          setStatus(
            'error'
          );

          setMessage(
            error?.message ||
            'حدث خطأ أثناء التحقق من التحديث.'
          );
        }
      }
    };

  const download =
    async () => {
      setStatus(
        'downloading'
      );

      setProgress(
        0
      );

      setMessage('');

      try {
        const result =
          await window.desktopAPI
            ?.downloadUpdate?.();

        if (
          result?.success
        ) {
          setStatus(
            'downloaded'
          );

          setInfo(
            current => ({
              ...current,

              downloadedPath:
                result.path,

              verified:
                result.verified
            })
          );
        } else {
          setStatus(
            'error'
          );

          setMessage(
            result?.message ||
            'فشل تنزيل ملف التحديث.'
          );
        }
      } catch (
        error
      ) {
        setStatus(
          'error'
        );

        setMessage(
          error?.message ||
          'فشل تنزيل ملف التحديث.'
        );
      }
    };

  useEffect(
    () => {
      const removeProgress =
        window.desktopAPI
          ?.onUpdateProgress?.(
            value => {
              setProgress(
                Math.max(
                  0,
                  Math.min(
                    100,
                    Number(
                      value ||
                      0
                    )
                  )
                )
              );
            }
          );

      const removeAvailable =
        window.desktopAPI
          ?.onUpdateAvailable?.(
            value => {
              if (
                value
                  ?.updateAvailable
              ) {
                setInfo(
                  value
                );

                setStatus(
                  'available'
                );
              }
            }
          );

      if (
        !autoChecked.current
      ) {
        autoChecked.current =
          true;

        window.setTimeout(
          () => {
            check(
              true
            );
          },
          1200
        );
      }

      return () => {
        removeProgress?.();
        removeAvailable?.();
      };
    },
    []
  );

  return (
    <div
      className="mt-3 rounded-2xl border p-3"
      style={{
        background:
          'var(--bg-secondary)',
        borderColor:
          'var(--border)'
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <Sparkles
              size={14}
              style={{
                color:
                  'var(--accent)'
              }}
            />

            تحديث البرنامج
          </div>

          <div
            className="mt-1 text-[9px] font-semibold"
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            يتم التحقق من آخر إصدار منشور على GitHub.
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            check(
              false
            )
          }
          disabled={
            status ===
              'checking' ||
            status ===
              'downloading'
          }
          className="flex h-9 shrink-0 items-center gap-2 rounded-xl border px-3 text-[10px] font-extrabold transition-all disabled:opacity-50"
          style={{
            background:
              'var(--surface)',
            borderColor:
              'var(--border)',
            color:
              'var(--text-primary)'
          }}
        >
          <RefreshCw
            size={13}
            className={
              status ===
              'checking'
                ? 'animate-spin'
                : ''
            }
          />

          {status ===
          'checking'
            ? 'جاري التحقق'
            : 'تحقق الآن'}
        </button>
      </div>

      <div
        className="mt-3 grid grid-cols-2 gap-2 text-[9px]"
        style={{
          color:
            'var(--text-secondary)'
        }}
      >
        <div
          className="rounded-xl border px-3 py-2"
          style={{
            background:
              'var(--surface)',
            borderColor:
              'var(--border)'
          }}
        >
          الإصدار الحالي
          <div
            className="mt-0.5 text-[11px] font-extrabold"
            style={{
              color:
                'var(--text-primary)'
            }}
          >
            {info
              ?.currentVersion ||
              '—'}
          </div>
        </div>

        <div
          className="rounded-xl border px-3 py-2"
          style={{
            background:
              'var(--surface)',
            borderColor:
              'var(--border)'
          }}
        >
          أحدث إصدار
          <div
            className="mt-0.5 text-[11px] font-extrabold"
            style={{
              color:
                info
                  ?.updateAvailable
                  ? 'var(--accent)'
                  : 'var(--text-primary)'
            }}
          >
            {info
              ?.latestVersion ||
              '—'}
          </div>
        </div>
      </div>

      {status ===
        'latest' && (
        <div className="mt-3">
          <UpdateStatusBox
            type="success"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2
                size={14}
              />
              أنت تستخدم أحدث إصدار.
            </span>
          </UpdateStatusBox>
        </div>
      )}

      {status ===
        'available' && (
        <div
          className="mt-3 rounded-xl border p-3"
          style={{
            background:
              'var(--surface)',
            borderColor:
              'var(--accent)'
          }}
        >
          <div
            className="text-[11px] font-extrabold"
            style={{
              color:
                'var(--accent)'
            }}
          >
            إصدار جديد متاح:
            {' '}
            {info
              ?.latestVersion}
          </div>

          {info?.notes && (
            <div
              className="mt-2 max-h-24 overflow-y-auto whitespace-pre-wrap rounded-lg px-2 py-1.5 text-[9px] leading-5"
              style={{
                background:
                  'var(--bg-secondary)',
                color:
                  'var(--text-secondary)'
              }}
            >
              {info.notes}
            </div>
          )}

          <button
            type="button"
            onClick={
              download
            }
            className="mt-3 flex h-9 items-center gap-2 rounded-xl px-3 text-[10px] font-extrabold text-white"
            style={{
              background:
                'var(--accent)'
            }}
          >
            <Download
              size={13}
            />
            تحميل التحديث إلى Downloads
          </button>
        </div>
      )}

      {status ===
        'downloading' && (
        <div
          className="mt-3 rounded-xl border p-3"
          style={{
            background:
              'var(--surface)',
            borderColor:
              'var(--border)'
          }}
        >
          <div className="mb-2 flex items-center justify-between text-[9px] font-extrabold">
            <span>
              جاري تنزيل النسخة الجديدة...
            </span>

            <span
              style={{
                color:
                  'var(--accent)'
              }}
            >
              {Math.round(
                progress
              )}%
            </span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full"
            style={{
              background:
                'var(--surface-hover)'
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width:
                  `${progress}%`,
                background:
                  'var(--accent)'
              }}
            />
          </div>
        </div>
      )}

      {status ===
        'downloaded' && (
        <div className="mt-3">
          <UpdateStatusBox
            type="success"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={14}
              />

              <span>
                تم تنزيل التحديث
                {info?.verified
                  ? ' والتحقق من سلامة الملف.'
                  : ' بنجاح.'}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                window.desktopAPI
                  ?.showDownloadedUpdate?.()
              }
              className="mt-2 flex h-8 items-center gap-2 rounded-lg border px-3 text-[9px] font-extrabold"
              style={{
                background:
                  'var(--surface)',
                borderColor:
                  'var(--accent)',
                color:
                  'var(--accent)'
              }}
            >
              <ExternalLink
                size={12}
              />
              فتح مكان الملف
            </button>
          </UpdateStatusBox>
        </div>
      )}

      {status ===
        'error' && (
        <div className="mt-3">
          <UpdateStatusBox
            type="error"
          >
            {message}
          </UpdateStatusBox>
        </div>
      )}
    </div>
  );
}
