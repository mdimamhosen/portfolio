const LogoIcon = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Award badge outer ring */}
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Inner decorative ring */}
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 3"
        fill="none"
        opacity="0.6"
      />
      
      {/* Letter I - Bold serif style */}
      <path
        d="M15 14H11V16H12.5V32H11V34H18V32H16.5V16H18V14H15Z"
        fill="currentColor"
      />
      
      {/* Letter H - Bold serif style */}
      <path
        d="M24 14V32H22.5V34H29V32H27.5V25H33.5V32H32V34H38.5V32H37V16H38.5V14H32V16H33.5V22.5H27.5V16H29V14H22.5V16H24V14Z"
        fill="currentColor"
      />
      
      {/* Top laurel leaves - left */}
      <path
        d="M8 18C10 14 14 12 18 12"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M10 20C11 17 14 15 17 14"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      
      {/* Top laurel leaves - right */}
      <path
        d="M40 18C38 14 34 12 30 12"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M38 20C37 17 34 15 31 14"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      
      {/* Bottom accent star */}
      <path
        d="M24 40L25 37L24 38L23 37L24 40Z"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Side decorative dots */}
      <circle cx="6" cy="24" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="42" cy="24" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
};

export default LogoIcon;
