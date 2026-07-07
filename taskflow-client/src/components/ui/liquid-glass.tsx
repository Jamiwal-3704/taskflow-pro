import React from "react";

// Types
export interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
  onClick?: () => void;
}

export interface DockIcon {
  src: string;
  alt: string;
  onClick?: () => void;
}

// ============================================================
// GLASS EFFECT WRAPPER
// ============================================================
export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
  onClick,
}) => {
  const content = (
    <div
      className={`relative flex font-semibold overflow-hidden cursor-pointer transition-all duration-500 ${className}`}
      style={{
        boxShadow:
          "0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.08)",
        transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
        ...style,
      }}
      onClick={onClick}
    >
      {/* Layer 1: Main backdrop blur */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />

      {/* Layer 2: Semi-transparent tint */}
      <div
        className="absolute inset-0 z-10 rounded-[inherit]"
        style={{
          background:
            "linear-gradient(135deg, var(--glass-highlight, rgba(255,255,255,0.18)) 0%, var(--glass-bg, rgba(255,255,255,0.08)) 50%, var(--glass-shine, rgba(255,255,255,0.04)) 100%)",
        }}
      />

      {/* Layer 3: Top edge shine */}
      <div
        className="absolute inset-0 z-20 rounded-[inherit] overflow-hidden pointer-events-none"
        style={{
          boxShadow:
            "inset 0 1.5px 0 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 0 rgba(255, 255, 255, 0.08), inset 1px 0 0 0 rgba(255, 255, 255, 0.12), inset -1px 0 0 0 rgba(255, 255, 255, 0.06)",
        }}
      />

      {/* Content */}
      <div className="relative z-30 w-full">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
};

// ============================================================
// GLASS DOCK (icon row)
// ============================================================
export const GlassDock: React.FC<{ icons: DockIcon[]; href?: string }> = ({
  icons,
  href,
}) => (
  <GlassEffect
    href={href}
    className="rounded-3xl p-3 hover:p-4 hover:rounded-4xl"
  >
    <div className="flex items-center justify-center gap-2 rounded-3xl p-3 py-0 px-0.5 overflow-hidden">
      {icons.map((icon, index) => (
        <img
          key={index}
          src={icon.src}
          alt={icon.alt}
          className="w-16 h-16 transition-all duration-500 hover:scale-110 cursor-pointer"
          style={{
            transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
          }}
          onClick={icon.onClick}
        />
      ))}
    </div>
  </GlassEffect>
);

// ============================================================
// GLASS BUTTON
// ============================================================
export const GlassButton: React.FC<{
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}> = ({ children, href, onClick, className = "" }) => (
  <GlassEffect
    href={href}
    onClick={onClick}
    className={`rounded-2xl px-5 py-3 hover:px-6 hover:py-3.5 hover:rounded-3xl overflow-hidden ${className}`}
  >
    <div
      className="transition-all duration-500 hover:scale-95"
      style={{
        transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
      }}
    >
      {children}
    </div>
  </GlassEffect>
);

// ============================================================
// SVG DISTORTION FILTER — render once at root level
// The fractalNoise + feDisplacementMap creates the "liquid" distortion
// ============================================================
export const GlassFilter: React.FC = () => (
  <svg
    style={{ position: "fixed", top: 0, left: 0, width: 0, height: 0, overflow: "hidden" }}
    aria-hidden="true"
  >
    <defs>
      <filter
        id="glass-distortion"
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
        colorInterpolationFilters="sRGB"
      >
        {/* Base turbulence for liquid look */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.008"
          numOctaves="3"
          seed="42"
          stitchTiles="stitch"
          result="noise"
        />
        {/* Increase amplitude of displacement */}
        <feColorMatrix
          in="noise"
          type="saturate"
          values="8"
          result="coloredNoise"
        />
        {/* Apply displacement for the liquid glass warping */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="coloredNoise"
          scale="12"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        {/* Specular lighting for the glass shine */}
        <feGaussianBlur in="coloredNoise" stdDeviation="1.5" result="blurredNoise" />
        <feSpecularLighting
          in="blurredNoise"
          surfaceScale="4"
          specularConstant="1.2"
          specularExponent="80"
          lightingColor="white"
          result="specLight"
        >
          <fePointLight x="-100" y="-200" z="400" />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          in2="displaced"
          operator="arithmetic"
          k1="0"
          k2="0.08"
          k3="0.8"
          k4="0"
          result="litGlass"
        />
      </filter>

      {/* Separate subtle distortion for panels/cards - less intense */}
      <filter
        id="glass-distortion-subtle"
        x="-5%"
        y="-5%"
        width="110%"
        height="110%"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.005"
          numOctaves="2"
          seed="17"
          result="turbulence"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="turbulence"
          scale="6"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);
