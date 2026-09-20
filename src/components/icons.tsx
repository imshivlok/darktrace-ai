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
