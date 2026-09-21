// Small stroke icon set shared by the console sidebar, top bar and chat panel.

interface IconProps {
  className?: string;
}

const base = {
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function IconPanel({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <path d="M9.5 4.5v15" />
    </svg>
  );
}

export function IconSearch({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </svg>
  );
}

export function IconNewChat({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M12 4.5H7.5a3 3 0 00-3 3v9a3 3 0 003 3h9a3 3 0 003-3V12" />
      <path d="M18.4 3.6a1.9 1.9 0 012.7 2.7L12.5 15l-3.7.9.9-3.7 8.7-8.6z" />
    </svg>
  );
}

export function IconChat({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M21 12a8 8 0 01-11.6 7.1L4 20.5l1.4-4.4A8 8 0 1121 12z" />
    </svg>
  );
}

export function IconClose({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconMenu({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconSend({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={2.25} aria-hidden="true">
      <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" />
    </svg>
  );
}

export function IconChevronDown({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={2} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconCheck({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={3} aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function IconHome({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v9h12v-9" />
    </svg>
  );
}

/* ---- Added for the home page menus and the voice button ---- */

export function IconMic({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <rect x="9" y="3.5" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3M8.5 21h7" />
    </svg>
  );
}

export function IconPlus({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={2} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconChevronRight({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} {...base} strokeWidth={2} aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconPaperclip({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M20 11.5l-7.6 7.6a5 5 0 01-7.1-7.1l8-8a3.3 3.3 0 014.7 4.7l-8 8a1.7 1.7 0 01-2.4-2.4l7.3-7.3" />
    </svg>
  );
}

export function IconClipboard({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <rect x="5.5" y="4.5" width="13" height="16" rx="2.5" />
      <path d="M9 4.5h6v2.2H9z" />
      <path d="M9 12h6M9 15.5h4" />
    </svg>
  );
}

export function IconHistory({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M4 12a8 8 0 108-8 8 8 0 00-6 2.7L4 9" />
      <path d="M4 4v5h5M12 8v4.5l3 1.8" />
    </svg>
  );
}

export function IconDots({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5.5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18.5" cy="12" r="1.6" />
    </svg>
  );
}

export function IconWallet({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M4.5 7.5A2.5 2.5 0 017 5h10.5v3" />
      <path d="M4.5 7.5v9A2.5 2.5 0 007 19h11.5a1 1 0 001-1V9a1 1 0 00-1-1H7a2.5 2.5 0 01-2.5-.5z" />
      <circle cx="15.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGlobe({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.6 2.4 3.8 5.2 3.8 8.5s-1.2 6.1-3.8 8.5c-2.6-2.4-3.8-5.2-3.8-8.5S9.4 5.9 12 3.5z" />
    </svg>
  );
}

export function IconPen({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M4 20h4L19 9a2.1 2.1 0 00-3-3L5 17l-1 3z" />
      <path d="M14 8l3 3" />
    </svg>
  );
}

export function IconGraph({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="5.5" cy="6" r="1.8" />
      <circle cx="18.5" cy="6" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
      <path d="M10.2 10.6L6.8 7.3M13.8 10.6l3.4-3.3M12 14.4v2.8" />
    </svg>
  );
}

export function IconKey({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="8" cy="15" r="3.6" />
      <path d="M10.6 12.4L20 3M16 7l2.5 2.5M13.5 9.5L15.5 11.5" />
    </svg>
  );
}

export function IconUser({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M4.8 20a7.2 7.2 0 0114.4 0" />
    </svg>
  );
}

export function IconCoin({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2c-.4-1-1.4-1.6-2.8-1.6-1.6 0-2.7.8-2.7 2s1 1.7 2.7 2 2.9.8 2.9 2.1-1.2 2.1-2.9 2.1c-1.5 0-2.6-.7-3-1.8M12 6v1.6M12 16.4V18" />
    </svg>
  );
}

export function IconMail({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="M4.5 7.5l7.5 5.5 7.5-5.5" />
    </svg>
  );
}

export function IconSettings({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14.5a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1.1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3h0a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v0a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </svg>
  );
}

export function IconBook({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M4.5 5.5A2 2 0 016.5 3.5H19v14H6.5a2 2 0 00-2 2v-14z" />
      <path d="M4.5 19.5a2 2 0 002 2H19v-4M9 8h6" />
    </svg>
  );
}

export function IconHelp({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.6a2.5 2.5 0 014.8.9c0 1.7-2.4 2-2.4 3.5M12 16.8v.1" />
    </svg>
  );
}

export function IconLogout({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} {...base} aria-hidden="true">
      <path d="M9.5 4.5H7a2.5 2.5 0 00-2.5 2.5v10A2.5 2.5 0 007 19.5h2.5" />
      <path d="M15 8l4 4-4 4M19 12H9.5" />
    </svg>
  );
}
