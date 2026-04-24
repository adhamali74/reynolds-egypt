export default function SectionDivider() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative -my-px flex h-px w-full items-center"
    >
      <span className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-magenta-500/70 to-transparent" />
      <span className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-magenta-500/25 to-transparent blur-[2px]" />
    </div>
  );
}
