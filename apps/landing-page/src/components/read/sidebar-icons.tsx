/**
 * Hand-coded stroke icons for the sidebar nav rows. Match the existing inline-SVG
 * convention used across the app: 24×24 viewBox, no fill, currentColor stroke at ~1.6,
 * rounded caps/joins, aria-hidden. Sized to 18px by default via the shared wrapper.
 */
'use client';

type IconProps = { className?: string; size?: number };

function Svg({ className, size = 18, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function IconGrid(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

export function IconSparkle(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3.5c.5 3.4 1.6 4.5 5 5-3.4.5-4.5 1.6-5 5-.5-3.4-1.6-4.5-5-5 3.4-.5 4.5-1.6 5-5Z" />
      <path d="M18.5 14.5c.25 1.7.8 2.25 2.5 2.5-1.7.25-2.25.8-2.5 2.5-.25-1.7-.8-2.25-2.5-2.5 1.7-.25 2.25-.8 2.5-2.5Z" />
    </Svg>
  );
}

export function IconPlayCircle(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 8.5 16 12l-6 3.5v-7Z" />
    </Svg>
  );
}

export function IconBookmark(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6.5 4.5h11a1 1 0 0 1 1 1V20l-6.5-3.8L5.5 20V5.5a1 1 0 0 1 1-1Z" />
    </Svg>
  );
}

export function IconCheckCircle(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.4 2.4 4.6-4.8" />
    </Svg>
  );
}

export function IconStar(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m12 4 2.45 4.97 5.49.8-3.97 3.87.94 5.46L12 16.98l-4.91 2.58.94-5.46-3.97-3.87 5.49-.8L12 4Z" />
    </Svg>
  );
}

export function IconBeaker(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9 3.5h6M10 3.5v6.2L5.4 17a2 2 0 0 0 1.7 3h9.8a2 2 0 0 0 1.7-3L14 9.7V3.5" />
      <path d="M7.5 14.5h9" />
    </Svg>
  );
}

export function IconCrown(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 7.5 7.5 14h9L20 7.5l-4.2 3L12 5l-3.8 5.5L4 7.5Z" />
      <path d="M7.5 17.5h9" />
    </Svg>
  );
}

export function IconClock(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Svg>
  );
}

export function IconPlus(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconChevronLeft(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14.5 6 9 12l5.5 6" />
    </Svg>
  );
}

export function IconChevronRight(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9.5 6 15 12l-5.5 6" />
    </Svg>
  );
}

export function IconSearch(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" />
    </Svg>
  );
}
