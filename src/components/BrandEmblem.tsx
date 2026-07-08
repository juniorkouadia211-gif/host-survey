/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface BrandEmblemProps {
  className?: string;
  size?: number;
}

export default function BrandEmblem({ className = "h-8 w-8", size = 32 }: BrandEmblemProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer framing lines (interrupted corner representing open scientific inquiry) */}
      <path 
        d="M 4 4 L 36 4 L 36 24 M 36 32 L 36 36 L 4 36 L 4 4" 
        stroke="currentColor" 
        strokeWidth="1.75" 
        strokeLinecap="square" 
        className="text-brand-primary"
      />
      
      {/* Precision Crosshair Guides (Subtle < 10% visual weight) */}
      <line 
        x1="20" y1="6" x2="20" y2="34" 
        stroke="currentColor" 
        strokeWidth="0.5" 
        strokeDasharray="2 2" 
        className="text-brand-primary/25" 
      />
      <line 
        x1="6" y1="20" x2="34" y2="20" 
        stroke="currentColor" 
        strokeWidth="0.5" 
        strokeDasharray="2 2" 
        className="text-brand-primary/25" 
      />

      {/* Scientific Dot Matrix representing structured data/respondents */}
      {/* Row 1 */}
      <circle cx="12" cy="12" r="2" className="fill-brand-accent" />
      <circle cx="20" cy="12" r="1.5" className="fill-brand-primary" />
      <circle cx="28" cy="12" r="1.5" className="fill-brand-primary/30" />
      
      {/* Row 2 */}
      <circle cx="12" cy="20" r="1.5" className="fill-brand-primary/45" />
      <circle cx="20" cy="20" r="2.5" className="fill-brand-primary" />
      <circle cx="28" cy="20" r="1.5" className="fill-brand-primary" />
      
      {/* Row 3 */}
      <circle cx="12" cy="28" r="1.5" className="fill-brand-primary/30" />
      <circle cx="20" cy="28" r="1.5" className="fill-brand-primary" />
      <circle cx="28" cy="28" r="2" className="fill-brand-accent" />
    </svg>
  );
}
