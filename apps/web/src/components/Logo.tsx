export default function Logo({ size = 22 }: { size?: number }) {
  const width = (size * 132) / 82
  return (
    <svg width={width} height={size} viewBox="0 0 132 82" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kglogo" x1="14" y1="6" x2="120" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffc2d6" />
          <stop offset=".38" stopColor="#ff5f9e" />
          <stop offset=".78" stopColor="#e22a72" />
          <stop offset="1" stopColor="#bb1659" />
        </linearGradient>
      </defs>
      <circle cx="86" cy="41" r="27" stroke="url(#kglogo)" strokeWidth="13.5" />
      <circle cx="46" cy="41" r="27" stroke="url(#kglogo)" strokeWidth="13.5" />
      <path d="M66 58.9 A27 27 0 0 0 80 66.4" stroke="url(#kglogo)" strokeWidth="13.5" strokeLinecap="round" />
    </svg>
  )
}
