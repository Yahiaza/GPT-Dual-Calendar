export default function StatusBar() {
  return (
    <footer
      className="flex h-[24px] shrink-0 items-center justify-between border-t px-4 text-[9px]"
      style={{
        background:
          'var(--bg-secondary)',
        borderColor:
          'var(--border)',
        color:
          'var(--text-muted)'
      }}
    >
      <span>
        GPT Dual Calendar
      </span>

      <span>
        Desktop
      </span>
    </footer>
  );
}
