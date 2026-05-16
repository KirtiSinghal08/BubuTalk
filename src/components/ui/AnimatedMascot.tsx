import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type MascotEmotion =
  | 'idle'
  | 'happy'
  | 'excited'
  | 'thinking'
  | 'listening'
  | 'speaking'
  | 'surprised'
  | 'encouraging'
  | 'waving';

export interface AnimatedMascotProps {
  emotion: MascotEmotion;
  isSpeaking: boolean;
  isListening: boolean;
  speakingIntensity?: number; // 0–1
  size?: number;
}

// ─── Per-emotion config ───────────────────────────────────────────────────────
interface EmotionCfg {
  // Eyebrow shape (left brow: inner/outer Y offsets from base)
  browLInnerY: number;
  browLOuterY: number;
  browRInnerY: number;
  browROuterY: number;
  browThickness: number;
  // Eye openness (1 = fully open, 0 = closed)
  eyeOpenL: number;
  eyeOpenR: number;
  // Pupil dilation & offset
  pupilScale: number;
  pupilOffX: number;
  pupilOffY: number;
  // Mouth
  mouthW: number;       // half-width
  mouthSmile: number;   // corner Y offset (positive = smile, negative = frown)
  mouthOpen: number;    // jaw drop (0 = closed)
  // Cheeks
  cheekOpacity: number;
  cheekScale: number;
  // Head
  headTilt: number;
  headBob: boolean;
  headNod: boolean;
  // Ambient
  bgColor: string;
  glowColor: string;
  blinkInterval: number;
}

const E: Record<MascotEmotion, EmotionCfg> = {
  idle: {
    browLInnerY: 0, browLOuterY: 0, browRInnerY: 0, browROuterY: 0, browThickness: 0.9,
    eyeOpenL: 0.95, eyeOpenR: 0.95,
    pupilScale: 1.15, pupilOffX: 0, pupilOffY: 0,
    mouthW: 0.12, mouthSmile: 0.04, mouthOpen: 0,
    cheekOpacity: 0.3, cheekScale: 1,
    headTilt: 0, headBob: false, headNod: false,
    bgColor: '#0F2240', glowColor: 'rgba(59,111,212,0.25)',
    blinkInterval: 3200,
  },
  happy: {
    browLInnerY: -0.03, browLOuterY: -0.02, browRInnerY: -0.03, browROuterY: -0.02, browThickness: 1,
    eyeOpenL: 0.8, eyeOpenR: 0.8,   // squinting with joy
    pupilScale: 1.2, pupilOffX: 0, pupilOffY: 0.005,
    mouthW: 0.22, mouthSmile: 0.08, mouthOpen: 0.015,
    cheekOpacity: 0.9, cheekScale: 1.2,
    headTilt: -5, headBob: true, headNod: false,
    bgColor: '#0F2E1A', glowColor: 'rgba(34,197,94,0.3)',
    blinkInterval: 2400,
  },
  excited: {
    browLInnerY: -0.045, browLOuterY: -0.035, browRInnerY: -0.045, browROuterY: -0.035, browThickness: 1.1,
    eyeOpenL: 1.1, eyeOpenR: 1.1,
    pupilScale: 1.3, pupilOffX: 0, pupilOffY: -0.01,
    mouthW: 0.25, mouthSmile: 0.095, mouthOpen: 0.05,
    cheekOpacity: 1, cheekScale: 1.3,
    headTilt: 6, headBob: true, headNod: false,
    bgColor: '#220F30', glowColor: 'rgba(240,98,146,0.4)',
    blinkInterval: 1600,
  },
  thinking: {
    browLInnerY: -0.035, browLOuterY: 0.015, browRInnerY: -0.01, browROuterY: 0.03, browThickness: 0.9,
    eyeOpenL: 0.85, eyeOpenR: 0.7,   // asymmetric squint
    pupilScale: 1, pupilOffX: 0.05, pupilOffY: -0.035,
    mouthW: 0.1, mouthSmile: -0.01, mouthOpen: 0,
    cheekOpacity: 0.2, cheekScale: 1,
    headTilt: 10, headBob: false, headNod: false,
    bgColor: '#0F1E30', glowColor: 'rgba(108,159,232,0.25)',
    blinkInterval: 4500,
  },
  listening: {
    browLInnerY: -0.02, browLOuterY: -0.015, browRInnerY: -0.02, browROuterY: -0.015, browThickness: 0.95,
    eyeOpenL: 0.98, eyeOpenR: 0.98,
    pupilScale: 1.18, pupilOffX: 0, pupilOffY: 0,
    mouthW: 0.13, mouthSmile: 0.03, mouthOpen: 0,
    cheekOpacity: 0.35, cheekScale: 1.05,
    headTilt: -6, headBob: false, headNod: true,
    bgColor: '#0F2240', glowColor: 'rgba(59,111,212,0.45)',
    blinkInterval: 2800,
  },
  speaking: {
    browLInnerY: -0.022, browLOuterY: -0.015, browRInnerY: -0.022, browROuterY: -0.015, browThickness: 0.95,
    eyeOpenL: 0.95, eyeOpenR: 0.95,
    pupilScale: 1.15, pupilOffX: 0, pupilOffY: 0,
    mouthW: 0.19, mouthSmile: 0.05, mouthOpen: 0.025,
    cheekOpacity: 0.5, cheekScale: 1.1,
    headTilt: 0, headBob: true, headNod: false,
    bgColor: '#0F2240', glowColor: 'rgba(59,111,212,0.35)',
    blinkInterval: 2200,
  },
  surprised: {
    browLInnerY: -0.06, browLOuterY: -0.045, browRInnerY: -0.06, browROuterY: -0.045, browThickness: 1.15,
    eyeOpenL: 1.2, eyeOpenR: 1.2,   // wide open
    pupilScale: 1.35, pupilOffX: 0, pupilOffY: 0,
    mouthW: 0.15, mouthSmile: 0, mouthOpen: 0.08,
    cheekOpacity: 0.25, cheekScale: 0.95,
    headTilt: 0, headBob: false, headNod: false,
    bgColor: '#221E0F', glowColor: 'rgba(251,191,36,0.4)',
    blinkInterval: 6000,
  },
  encouraging: {
    browLInnerY: -0.035, browLOuterY: -0.025, browRInnerY: -0.035, browROuterY: -0.025, browThickness: 1,
    eyeOpenL: 0.82, eyeOpenR: 0.82,
    pupilScale: 1.2, pupilOffX: 0, pupilOffY: 0.005,
    mouthW: 0.23, mouthSmile: 0.085, mouthOpen: 0.02,
    cheekOpacity: 0.95, cheekScale: 1.25,
    headTilt: -5, headBob: true, headNod: false,
    bgColor: '#0F2E1A', glowColor: 'rgba(34,197,94,0.38)',
    blinkInterval: 2000,
  },
  waving: {
    browLInnerY: -0.032, browLOuterY: -0.022, browRInnerY: -0.032, browROuterY: -0.022, browThickness: 1,
    eyeOpenL: 0.85, eyeOpenR: 0.85,
    pupilScale: 1.18, pupilOffX: 0.02, pupilOffY: 0,
    mouthW: 0.21, mouthSmile: 0.075, mouthOpen: 0.012,
    cheekOpacity: 0.85, cheekScale: 1.2,
    headTilt: -7, headBob: true, headNod: false,
    bgColor: '#0F2240', glowColor: 'rgba(59,111,212,0.38)',
    blinkInterval: 2500,
  },
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function AnimatedMascot({
  emotion,
  isSpeaking,
  isListening,
  speakingIntensity = 0,
  size = 320,
}: AnimatedMascotProps) {
  const cfg = E[emotion];
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Realistic blink scheduler ──
  useEffect(() => {
    let mounted = true;
    const schedule = () => {
      const jitter = (Math.random() - 0.5) * cfg.blinkInterval * 0.6;
      blinkTimer.current = setTimeout(() => {
        if (!mounted) return;
        setIsBlinking(true);
        setTimeout(() => {
          if (!mounted) return;
          setIsBlinking(false);
          schedule();
        }, 110);
      }, cfg.blinkInterval + jitter);
    };
    schedule();
    return () => {
      mounted = false;
      if (blinkTimer.current) clearTimeout(blinkTimer.current);
    };
  }, [cfg.blinkInterval]);

  // ── Geometry ──
  const S = size;
  const CX = S / 2;
  const CY = S / 2;

  // Face (rounder, cuter proportions)
  const FR = S * 0.38;          // face radius (slightly bigger)
  const FRY = FR * 1.12;        // face vertical radius (rounder)

  // Eyes (bigger for cuteness)
  const EY = CY - FR * 0.1;    // eye center Y (slightly higher)
  const EX = FR * 0.32;        // eye X offset from center (closer together)
  const ERX = FR * 0.22;       // eye white half-width (bigger)
  const ERY = FR * 0.19;       // eye white half-height (bigger)

  // Effective eye openness
  const eOpenL = isBlinking ? 0 : cfg.eyeOpenL;
  const eOpenR = isBlinking ? 0 : cfg.eyeOpenR;

  // Pupil (bigger for cute look)
  const PR = FR * 0.095 * cfg.pupilScale;   // iris radius
  const pupX = FR * cfg.pupilOffX;
  const pupY = FR * cfg.pupilOffY;

  // Eyebrows (softer, thinner)
  const BRY = EY - ERY * 1.25;  // brow base Y (closer to eyes)
  const BRW = ERX * 1.2;        // brow half-width

  // Nose (smaller, cuter)
  const NY = CY + FR * 0.08;

  // Mouth
  const MY = CY + FR * 0.38;
  const MW = FR * cfg.mouthW;
  const MS = FR * cfg.mouthSmile;

  // Dynamic mouth from speaking
  const dynOpen = isSpeaking
    ? Math.max(cfg.mouthOpen, speakingIntensity * 0.14) * FR
    : cfg.mouthOpen * FR;

  // Ear (slightly smaller)
  const EAR_R = FR * 0.12;
  const EAR_Y = CY - FR * 0.03;

  // Cheek (bigger, rounder)
  const CKX = EX * 1.6;
  const CKY = EY + FR * 0.25;
  const CKR = FR * 0.16;

  // Neck / shirt
  const NECK_W = FR * 0.34;
  const SHIRT_Y = CY + FRY * 0.85;

  return (
    <div style={{ width: S, height: S, position: 'relative', flexShrink: 0 }}>

      {/* ── Outer glow ── */}
      <motion.div
        animate={{
          boxShadow: isListening
            ? [
                `0 0 0 0px ${cfg.glowColor}`,
                `0 0 0 ${S * 0.055}px ${cfg.glowColor}`,
                `0 0 0 0px ${cfg.glowColor}`,
              ]
            : `0 0 ${S * 0.1}px ${cfg.glowColor}`,
        }}
        transition={
          isListening
            ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.5 }
        }
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none' }}
      />

      {/* ── SVG ── */}
      <motion.svg
        width={S} height={S}
        viewBox={`0 0 ${S} ${S}`}
        animate={{
          rotate: cfg.headTilt,
          y: cfg.headBob ? [0, -S * 0.013, 0] : cfg.headNod ? [0, S * 0.01, 0] : 0,
        }}
        transition={
          cfg.headBob || cfg.headNod
            ? { duration: cfg.headNod ? 1.0 : 1.5, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
        }
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Background */}
          <radialGradient id="bgG" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor={cfg.bgColor} />
            <stop offset="100%" stopColor="#060E1C" />
          </radialGradient>
          {/* Skin — softer, cuter gradient */}
          <radialGradient id="skinG" cx="42%" cy="30%" r="65%">
            <stop offset="0%"  stopColor="#FFE8D0" />
            <stop offset="50%" stopColor="#FFCFA0" />
            <stop offset="85%" stopColor="#FFB880" />
            <stop offset="100%" stopColor="#F0A870" />
          </radialGradient>
          {/* Skin shadow (softer) */}
          <radialGradient id="skinShadowG" cx="50%" cy="90%" r="55%">
            <stop offset="0%"  stopColor="#D89060" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D89060" stopOpacity="0" />
          </radialGradient>
          {/* Ear */}
          <radialGradient id="earG" cx="60%" cy="40%" r="55%">
            <stop offset="0%"  stopColor="#FFC890" />
            <stop offset="100%" stopColor="#F0A870" />
          </radialGradient>
          {/* Hair (softer brown) */}
          <radialGradient id="hairG" cx="50%" cy="10%" r="75%">
            <stop offset="0%"  stopColor="#8B5A3C" />
            <stop offset="55%" stopColor="#5D3A22" />
            <stop offset="100%" stopColor="#3A2415" />
          </radialGradient>
          {/* Hair shine */}
          <radialGradient id="hairShineG" cx="40%" cy="20%" r="40%">
            <stop offset="0%"  stopColor="rgba(255,220,180,0.25)" />
            <stop offset="100%" stopColor="rgba(255,220,180,0)" />
          </radialGradient>
          {/* Eye white (brighter) */}
          <radialGradient id="eyeWhiteG" cx="35%" cy="30%" r="60%">
            <stop offset="0%"  stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F0F0FF" />
          </radialGradient>
          {/* Iris (brighter, more vibrant) */}
          <radialGradient id="irisG" cx="35%" cy="30%" r="65%">
            <stop offset="0%"  stopColor="#7BA8FF" />
            <stop offset="50%" stopColor="#4A7FE8" />
            <stop offset="100%" stopColor="#2D5EC4" />
          </radialGradient>
          {/* Iris ring detail */}
          <radialGradient id="irisRingG" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
          </radialGradient>
          {/* Cheek blush (softer pink) */}
          <radialGradient id="cheekG" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#FFB0C8" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#FFB0C8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFB0C8" stopOpacity="0" />
          </radialGradient>
          {/* Shirt (brighter blue) */}
          <linearGradient id="shirtG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#5A9FFF" />
            <stop offset="100%" stopColor="#3B6FD4" />
          </linearGradient>
          {/* Shirt shadow */}
          <linearGradient id="shirtShadowG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="rgba(0,0,0,0.12)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          {/* Neck */}
          <linearGradient id="neckG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="#F0A870" />
            <stop offset="40%" stopColor="#FFCFA0" />
            <stop offset="100%" stopColor="#F0A870" />
          </linearGradient>
          {/* Eyelid (skin-colored for blink) */}
          <linearGradient id="eyelidG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#FFCFA0" />
            <stop offset="100%" stopColor="#FFB880" />
          </linearGradient>
          {/* Upper eyelid shadow (softer) */}
          <linearGradient id="lidShadowG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="rgba(100,60,30,0.25)" />
            <stop offset="100%" stopColor="rgba(80,40,10,0)" />
          </linearGradient>
          {/* Mouth interior */}
          <radialGradient id="mouthInteriorG" cx="50%" cy="30%" r="60%">
            <stop offset="0%"  stopColor="#8B1A1A" />
            <stop offset="100%" stopColor="#5A0A0A" />
          </radialGradient>
          {/* Clip paths */}
          <clipPath id="faceClip">
            <ellipse cx={CX} cy={CY} rx={FR} ry={FRY} />
          </clipPath>
          <clipPath id={`eyeClipL`}>
            <ellipse cx={CX - EX} cy={EY} rx={ERX * 1.05} ry={ERY * eOpenL * 1.1} />
          </clipPath>
          <clipPath id={`eyeClipR`}>
            <ellipse cx={CX + EX} cy={EY} rx={ERX * 1.05} ry={ERY * eOpenR * 1.1} />
          </clipPath>
        </defs>

        {/* ── Background ── */}
        <circle cx={CX} cy={CY} r={S * 0.47} fill="url(#bgG)" />
        {/* Subtle radial lines */}
        {[0,30,60,90,120,150].map(a => (
          <line key={a}
            x1={CX} y1={CY}
            x2={CX + Math.cos(a * Math.PI/180) * S * 0.47}
            y2={CY + Math.sin(a * Math.PI/180) * S * 0.47}
            stroke="rgba(255,255,255,0.018)" strokeWidth={1}
          />
        ))}

        {/* ── Shirt / body ── */}
        <ellipse
          cx={CX} cy={SHIRT_Y + FR * 0.55}
          rx={FR * 1.18} ry={FR * 0.72}
          fill="url(#shirtG)"
        />
        {/* Shirt shadow overlay */}
        <ellipse
          cx={CX} cy={SHIRT_Y + FR * 0.3}
          rx={FR * 1.18} ry={FR * 0.45}
          fill="url(#shirtShadowG)"
        />
        {/* Collar V */}
        <path
          d={`M ${CX - FR * 0.22} ${SHIRT_Y}
              L ${CX} ${SHIRT_Y + FR * 0.22}
              L ${CX + FR * 0.22} ${SHIRT_Y}`}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={S * 0.013}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Neck ── */}
        <rect
          x={CX - NECK_W / 2} y={CY + FRY * 0.82}
          width={NECK_W} height={FR * 0.22}
          rx={NECK_W * 0.4}
          fill="url(#neckG)"
        />

        {/* ── Ears ── */}
        {/* Left ear */}
        <ellipse cx={CX - FR * 0.97} cy={EAR_Y} rx={EAR_R} ry={EAR_R * 1.18} fill="url(#earG)" />
        <ellipse cx={CX - FR * 0.97} cy={EAR_Y} rx={EAR_R * 0.52} ry={EAR_R * 0.7} fill="#C07040" opacity={0.45} />
        <ellipse cx={CX - FR * 0.97} cy={EAR_Y + EAR_R * 0.1} rx={EAR_R * 0.28} ry={EAR_R * 0.38} fill="#A05030" opacity={0.3} />
        {/* Right ear */}
        <ellipse cx={CX + FR * 0.97} cy={EAR_Y} rx={EAR_R} ry={EAR_R * 1.18} fill="url(#earG)" />
        <ellipse cx={CX + FR * 0.97} cy={EAR_Y} rx={EAR_R * 0.52} ry={EAR_R * 0.7} fill="#C07040" opacity={0.45} />
        <ellipse cx={CX + FR * 0.97} cy={EAR_Y + EAR_R * 0.1} rx={EAR_R * 0.28} ry={EAR_R * 0.38} fill="#A05030" opacity={0.3} />

        {/* ── Face base ── */}
        <ellipse cx={CX} cy={CY} rx={FR} ry={FRY} fill="url(#skinG)" />
        {/* Subsurface scatter / shadow on sides */}
        <ellipse cx={CX} cy={CY} rx={FR} ry={FRY} fill="url(#skinShadowG)" />
        {/* Forehead highlight */}
        <ellipse
          cx={CX - FR * 0.08} cy={CY - FRY * 0.52}
          rx={FR * 0.38} ry={FR * 0.22}
          fill="rgba(255,240,210,0.18)"
        />

        {/* ── Hair ── */}
        {/* Main hair mass */}
        <ellipse
          cx={CX} cy={CY - FRY * 0.68}
          rx={FR * 1.04} ry={FR * 0.58}
          fill="url(#hairG)"
        />
        {/* Hair comes down sides */}
        <ellipse cx={CX - FR * 0.82} cy={CY - FRY * 0.35} rx={FR * 0.28} ry={FR * 0.42} fill="#2A1005" />
        <ellipse cx={CX + FR * 0.82} cy={CY - FRY * 0.35} rx={FR * 0.28} ry={FR * 0.42} fill="#2A1005" />
        {/* Hair tufts on top */}
        <ellipse cx={CX}           cy={CY - FRY * 1.08} rx={FR * 0.22} ry={FR * 0.2}  fill="#2A1005" />
        <ellipse cx={CX - FR * 0.2} cy={CY - FRY * 1.06} rx={FR * 0.15} ry={FR * 0.16} fill="#2A1005" />
        <ellipse cx={CX + FR * 0.2} cy={CY - FRY * 1.06} rx={FR * 0.15} ry={FR * 0.16} fill="#2A1005" />
        {/* Hair shine */}
        <ellipse
          cx={CX - FR * 0.12} cy={CY - FRY * 0.78}
          rx={FR * 0.32} ry={FR * 0.14}
          fill="url(#hairShineG)"
        />

        {/* ── Cheeks ── */}
        <motion.ellipse
          cx={CX - CKX} cy={CKY}
          rx={CKR * cfg.cheekScale} ry={CKR * 0.62 * cfg.cheekScale}
          fill="url(#cheekG)"
          animate={{ opacity: cfg.cheekOpacity }}
          transition={{ duration: 0.4 }}
        />
        <motion.ellipse
          cx={CX + CKX} cy={CKY}
          rx={CKR * cfg.cheekScale} ry={CKR * 0.62 * cfg.cheekScale}
          fill="url(#cheekG)"
          animate={{ opacity: cfg.cheekOpacity }}
          transition={{ duration: 0.4 }}
        />

        {/* ══ LEFT EYE ══ */}
        <EyeGroup
          cx={CX - EX} cy={EY}
          erx={ERX} ery={ERY}
          openness={eOpenL}
          pr={PR} px={pupX} py={pupY}
          side="L"
          emotion={emotion}
        />

        {/* ══ RIGHT EYE ══ */}
        <EyeGroup
          cx={CX + EX} cy={EY}
          erx={ERX} ery={ERY}
          openness={eOpenR}
          pr={PR} px={pupX} py={pupY}
          side="R"
          emotion={emotion}
        />

        {/* ── Eyebrows ── */}
        <EyebrowGroup
          cx={CX} ey={EY} erx={ERX} ery={ERY}
          ex={EX} brw={BRW} bry={BRY}
          cfg={cfg} S={S}
        />

        {/* ── Nose ── */}
        <NoseGroup cx={CX} ny={NY} fr={FR} />

        {/* ── Mouth ── */}
        <MouthGroup
          cx={CX} my={MY} mw={MW} ms={MS}
          dynOpen={dynOpen}
          isSpeaking={isSpeaking}
          emotion={emotion}
          fr={FR}
        />

        {/* ── Emotion FX ── */}
        <EmotionFX emotion={emotion} cx={CX} cy={CY} fr={FR} s={S} isListening={isListening} />

      </motion.svg>
    </div>
  );
}

// ─── Eye group ────────────────────────────────────────────────────────────────
function EyeGroup({
  cx, cy, erx, ery, openness, pr, px, py, side, emotion,
}: {
  cx: number; cy: number; erx: number; ery: number;
  openness: number; pr: number; px: number; py: number;
  side: 'L' | 'R'; emotion: MascotEmotion;
}) {
  const effectiveEry = ery * Math.max(openness, 0.02);
  const clipId = `eyeClip${side}-${emotion}`;

  // Eyelid crease color
  const lidCreaseColor = '#8B5020';

  return (
    <g>
      {/* Eye white */}
      <ellipse cx={cx} cy={cy} rx={erx} ry={effectiveEry} fill="url(#eyeWhiteG)" />

      {/* Iris + pupil clipped to eye white */}
      <g clipPath={`url(#${clipId})`}>
        <defs>
          <clipPath id={clipId}>
            <ellipse cx={cx} cy={cy} rx={erx * 1.02} ry={effectiveEry * 1.02} />
          </clipPath>
        </defs>
        {/* Iris */}
        <motion.circle
          cx={cx + px} cy={cy + py} r={pr}
          fill="url(#irisG)"
          animate={{ r: pr }}
          transition={{ duration: 0.3 }}
        />
        {/* Iris ring */}
        <circle cx={cx + px} cy={cy + py} r={pr} fill="url(#irisRingG)" />
        {/* Iris texture lines */}
        {[0, 45, 90, 135].map(a => (
          <line key={a}
            x1={cx + px} y1={cy + py}
            x2={cx + px + Math.cos(a * Math.PI/180) * pr * 0.9}
            y2={cy + py + Math.sin(a * Math.PI/180) * pr * 0.9}
            stroke="rgba(255,255,255,0.07)" strokeWidth={pr * 0.18}
          />
        ))}
        {/* Pupil */}
        <motion.circle
          cx={cx + px} cy={cy + py} r={pr * 0.52}
          fill="#0A0A18"
          animate={{ r: pr * 0.52 }}
          transition={{ duration: 0.3 }}
        />
        {/* Primary shine */}
        <circle
          cx={cx + px + pr * 0.28} cy={cy + py - pr * 0.32}
          r={pr * 0.22} fill="white" opacity={0.92}
        />
        {/* Secondary shine */}
        <circle
          cx={cx + px - pr * 0.18} cy={cy + py + pr * 0.3}
          r={pr * 0.11} fill="white" opacity={0.45}
        />
        {/* Upper eyelid shadow inside eye */}
        <ellipse
          cx={cx} cy={cy - effectiveEry * 0.55}
          rx={erx * 0.9} ry={effectiveEry * 0.38}
          fill="url(#lidShadowG)"
        />
      </g>

      {/* Eye outline */}
      <ellipse
        cx={cx} cy={cy} rx={erx} ry={effectiveEry}
        fill="none" stroke={lidCreaseColor} strokeWidth={erx * 0.055} opacity={0.5}
      />

      {/* Upper eyelid line (lash line) - softer */}
      <path
        d={`M ${cx - erx} ${cy}
            Q ${cx} ${cy - effectiveEry * 1.08}
            ${cx + erx} ${cy}`}
        fill="none"
        stroke="#5D3A22"
        strokeWidth={erx * 0.09}
        strokeLinecap="round"
        opacity={0.7}
      />

      {/* Lower eyelid subtle line */}
      <path
        d={`M ${cx - erx * 0.85} ${cy + effectiveEry * 0.6}
            Q ${cx} ${cy + effectiveEry * 0.95}
            ${cx + erx * 0.85} ${cy + effectiveEry * 0.6}`}
        fill="none"
        stroke="#8B5020"
        strokeWidth={erx * 0.04}
        strokeLinecap="round"
        opacity={0.3}
      />

      {/* Eyelashes (upper) - softer */}
      {[-0.7, -0.35, 0, 0.35, 0.7].map((t, i) => {
        const lx = cx + t * erx;
        const ly = cy - effectiveEry * (1 - t * t * 0.15);
        const angle = -90 + t * 25;
        return (
          <line key={i}
            x1={lx} y1={ly}
            x2={lx + Math.cos(angle * Math.PI/180) * erx * 0.14}
            y2={ly + Math.sin(angle * Math.PI/180) * erx * 0.14}
            stroke="#5D3A22"
            strokeWidth={erx * 0.06}
            strokeLinecap="round"
            opacity={0.75}
          />
        );
      })}
    </g>
  );
}

// ─── Eyebrow group ────────────────────────────────────────────────────────────
function EyebrowGroup({
  cx, ey, erx, ery, ex, brw, bry, cfg, S,
}: {
  cx: number; ey: number; erx: number; ery: number;
  ex: number; brw: number; bry: number;
  cfg: EmotionCfg; S: number;
}) {
  const thick = S * 0.018 * cfg.browThickness; // Thinner for cuter look
  const baseY = bry;

  // Left brow: inner = toward center, outer = away from center
  const lInnerX = cx - ex + brw * 0.1;
  const lOuterX = cx - ex - brw * 0.85;
  const lMidX   = cx - ex - brw * 0.38;
  const lInnerY = baseY + S * cfg.browLInnerY;
  const lOuterY = baseY + S * cfg.browLOuterY;
  const lMidY   = (lInnerY + lOuterY) / 2 - S * 0.008;

  // Right brow
  const rInnerX = cx + ex - brw * 0.1;
  const rOuterX = cx + ex + brw * 0.85;
  const rMidX   = cx + ex + brw * 0.38;
  const rInnerY = baseY + S * cfg.browRInnerY;
  const rOuterY = baseY + S * cfg.browROuterY;
  const rMidY   = (rInnerY + rOuterY) / 2 - S * 0.008;

  return (
    <g>
      {/* Left eyebrow — softer, rounder */}
      <motion.path
        d={`M ${lOuterX} ${lOuterY} Q ${lMidX} ${lMidY} ${lInnerX} ${lInnerY}`}
        fill="none"
        stroke="#5D3A22"
        strokeWidth={thick}
        strokeLinecap="round"
        animate={{
          d: `M ${lOuterX} ${lOuterY} Q ${lMidX} ${lMidY} ${lInnerX} ${lInnerY}`,
        }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Left brow inner thicker part */}
      <motion.path
        d={`M ${lMidX} ${lMidY} Q ${lInnerX - brw * 0.2} ${lInnerY - S * 0.003} ${lInnerX} ${lInnerY}`}
        fill="none"
        stroke="#5D3A22"
        strokeWidth={thick * 1.2}
        strokeLinecap="round"
        animate={{
          d: `M ${lMidX} ${lMidY} Q ${lInnerX - brw * 0.2} ${lInnerY - S * 0.003} ${lInnerX} ${lInnerY}`,
        }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Right eyebrow */}
      <motion.path
        d={`M ${rOuterX} ${rOuterY} Q ${rMidX} ${rMidY} ${rInnerX} ${rInnerY}`}
        fill="none"
        stroke="#5D3A22"
        strokeWidth={thick}
        strokeLinecap="round"
        animate={{
          d: `M ${rOuterX} ${rOuterY} Q ${rMidX} ${rMidY} ${rInnerX} ${rInnerY}`,
        }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d={`M ${rMidX} ${rMidY} Q ${rInnerX + brw * 0.2} ${rInnerY - S * 0.003} ${rInnerX} ${rInnerY}`}
        fill="none"
        stroke="#5D3A22"
        strokeWidth={thick * 1.2}
        strokeLinecap="round"
        animate={{
          d: `M ${rMidX} ${rMidY} Q ${rInnerX + brw * 0.2} ${rInnerY - S * 0.003} ${rInnerX} ${rInnerY}`,
        }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      />
    </g>
  );
}

// ─── Nose group ───────────────────────────────────────────────────────────────
function NoseGroup({ cx, ny, fr }: { cx: number; ny: number; fr: number }) {
  const nw = fr * 0.11;
  const nh = fr * 0.13;
  return (
    <g opacity={0.85}>
      {/* Nose bridge subtle shadow */}
      <path
        d={`M ${cx} ${ny - nh * 1.4} Q ${cx - nw * 0.3} ${ny - nh * 0.3} ${cx - nw * 0.8} ${ny + nh * 0.2}`}
        fill="none" stroke="#C07040" strokeWidth={fr * 0.022} strokeLinecap="round" opacity={0.35}
      />
      {/* Left nostril */}
      <ellipse cx={cx - nw * 0.72} cy={ny + nh * 0.1} rx={nw * 0.55} ry={nw * 0.38} fill="#C07040" opacity={0.55} />
      <ellipse cx={cx - nw * 0.72} cy={ny + nh * 0.1} rx={nw * 0.28} ry={nw * 0.2}  fill="#8B4020" opacity={0.4} />
      {/* Right nostril */}
      <ellipse cx={cx + nw * 0.72} cy={ny + nh * 0.1} rx={nw * 0.55} ry={nw * 0.38} fill="#C07040" opacity={0.55} />
      <ellipse cx={cx + nw * 0.72} cy={ny + nh * 0.1} rx={nw * 0.28} ry={nw * 0.2}  fill="#8B4020" opacity={0.4} />
      {/* Nose tip highlight */}
      <ellipse cx={cx} cy={ny + nh * 0.05} rx={nw * 0.38} ry={nw * 0.25} fill="rgba(255,220,170,0.22)" />
    </g>
  );
}

// ─── Mouth group ──────────────────────────────────────────────────────────────
function MouthGroup({
  cx, my, mw, ms, dynOpen, isSpeaking, emotion, fr,
}: {
  cx: number; my: number; mw: number; ms: number;
  dynOpen: number; isSpeaking: boolean; emotion: MascotEmotion;
  fr: number;
}) {
  const lx = cx - mw;
  const rx = cx + mw;
  const cornerY = my + ms;
  const topY = my - dynOpen * 0.5;
  const botY = my + dynOpen;
  const isOpen = dynOpen > fr * 0.015;

  return (
    <g>
      {isOpen ? (
        // ── Open mouth ──
        <g>
          {/* Mouth interior */}
          <path
            d={`M ${lx} ${cornerY}
                Q ${cx} ${topY - ms * 0.3} ${rx} ${cornerY}
                Q ${cx + mw * 0.7} ${botY + ms * 0.5} ${cx} ${botY + ms * 0.6}
                Q ${cx - mw * 0.7} ${botY + ms * 0.5} ${lx} ${cornerY} Z`}
            fill="url(#mouthInteriorG)"
          />
          {/* Upper teeth */}
          <path
            d={`M ${lx + mw * 0.15} ${cornerY + ms * 0.1}
                Q ${cx} ${topY - ms * 0.1} ${rx - mw * 0.15} ${cornerY + ms * 0.1}
                L ${rx - mw * 0.15} ${cornerY + ms * 0.1 + fr * 0.04}
                Q ${cx} ${topY - ms * 0.1 + fr * 0.04} ${lx + mw * 0.15} ${cornerY + ms * 0.1 + fr * 0.04} Z`}
            fill="white" opacity={0.95}
          />
          {/* Tooth dividers */}
          {[-0.4, 0, 0.4].map((t, i) => (
            <line key={i}
              x1={cx + t * mw * 0.7} y1={cornerY + ms * 0.1}
              x2={cx + t * mw * 0.7} y2={cornerY + ms * 0.1 + fr * 0.04}
              stroke="rgba(200,200,220,0.4)" strokeWidth={fr * 0.008}
            />
          ))}
          {/* Lower teeth (partial) */}
          {dynOpen > fr * 0.04 && (
            <path
              d={`M ${cx - mw * 0.55} ${botY + ms * 0.15}
                  Q ${cx} ${botY + ms * 0.5} ${cx + mw * 0.55} ${botY + ms * 0.15}
                  L ${cx + mw * 0.55} ${botY + ms * 0.15 - fr * 0.03}
                  Q ${cx} ${botY + ms * 0.5 - fr * 0.03} ${cx - mw * 0.55} ${botY + ms * 0.15 - fr * 0.03} Z`}
              fill="white" opacity={0.8}
            />
          )}
          {/* Upper lip */}
          <path
            d={`M ${lx} ${cornerY}
                Q ${cx - mw * 0.5} ${my - ms * 0.6} ${cx} ${my - ms * 0.8}
                Q ${cx + mw * 0.5} ${my - ms * 0.6} ${rx} ${cornerY}`}
            fill="#D4607A" opacity={0.9}
          />
          {/* Lower lip */}
          <path
            d={`M ${lx} ${cornerY}
                Q ${cx} ${botY + ms * 0.7} ${rx} ${cornerY}`}
            fill="#C04060" opacity={0.85}
          />
          {/* Lip highlight */}
          <ellipse
            cx={cx} cy={my - ms * 0.5}
            rx={mw * 0.38} ry={fr * 0.018}
            fill="rgba(255,180,190,0.35)"
          />
        </g>
      ) : (
        // ── Closed mouth ──
        <g>
          {/* Mouth line */}
          <motion.path
            d={`M ${lx} ${cornerY} Q ${cx} ${my + ms * 1.6} ${rx} ${cornerY}`}
            fill="none"
            stroke="#B84060"
            strokeWidth={fr * 0.038}
            strokeLinecap="round"
            animate={{ d: `M ${lx} ${cornerY} Q ${cx} ${my + ms * 1.6} ${rx} ${cornerY}` }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Upper lip shape */}
          <motion.path
            d={`M ${lx + mw * 0.1} ${cornerY}
                Q ${cx - mw * 0.45} ${my - ms * 0.5} ${cx} ${my - ms * 0.65}
                Q ${cx + mw * 0.45} ${my - ms * 0.5} ${rx - mw * 0.1} ${cornerY}`}
            fill="none"
            stroke="#C04060"
            strokeWidth={fr * 0.025}
            strokeLinecap="round"
            opacity={0.7}
            animate={{
              d: `M ${lx + mw * 0.1} ${cornerY} Q ${cx - mw * 0.45} ${my - ms * 0.5} ${cx} ${my - ms * 0.65} Q ${cx + mw * 0.45} ${my - ms * 0.5} ${rx - mw * 0.1} ${cornerY}`,
            }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Lip highlight */}
          <ellipse
            cx={cx} cy={my - ms * 0.3}
            rx={mw * 0.32} ry={fr * 0.014}
            fill="rgba(255,160,180,0.28)"
          />
        </g>
      )}
    </g>
  );
}

// ─── Emotion FX ───────────────────────────────────────────────────────────────
function EmotionFX({
  emotion, cx, cy, fr, s, isListening,
}: {
  emotion: MascotEmotion; cx: number; cy: number; fr: number; s: number; isListening: boolean;
}) {
  return (
    <>
      {/* Waving arm */}
      {emotion === 'waving' && (
        <motion.g
          animate={{ rotate: [-12, 22, -12] }}
          transition={{ duration: 0.48, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${cx + fr * 1.05}px ${cy + fr * 0.45}px` }}
        >
          {/* Upper arm */}
          <path
            d={`M ${cx + fr * 0.72} ${cy + fr * 0.6}
                Q ${cx + fr * 0.95} ${cy + fr * 0.35}
                ${cx + fr * 1.05} ${cy + fr * 0.1}`}
            fill="none" stroke="#FFBF80" strokeWidth={s * 0.065} strokeLinecap="round"
          />
          {/* Hand */}
          <circle cx={cx + fr * 1.05} cy={cy + fr * 0.05} r={s * 0.052} fill="#FFBF80" />
          {/* Fingers */}
          {[-0.3, 0, 0.3].map((t, i) => (
            <ellipse key={i}
              cx={cx + fr * 1.05 + t * s * 0.025}
              cy={cy + fr * 0.05 - s * 0.045}
              rx={s * 0.012} ry={s * 0.022}
              fill="#FFBF80"
            />
          ))}
        </motion.g>
      )}

      {/* Thinking bubbles */}
      {emotion === 'thinking' && (
        <g>
          {[
            { cx: cx + fr * 0.72, cy: cy - fr * 0.82, r: s * 0.022, delay: 0 },
            { cx: cx + fr * 0.88, cy: cy - fr * 1.02, r: s * 0.034, delay: 0.22 },
            { cx: cx + fr * 1.02, cy: cy - fr * 1.22, r: s * 0.048, delay: 0.44 },
          ].map((b, i) => (
            <motion.circle key={i}
              cx={b.cx} cy={b.cy} r={b.r}
              fill="rgba(180,200,255,0.18)"
              stroke="rgba(180,200,255,0.35)"
              strokeWidth={1}
              animate={{ opacity: [0.25, 0.75, 0.25], scale: [0.9, 1.08, 0.9] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: b.delay }}
            />
          ))}
          {/* Question mark in bubble */}
          <motion.text
            x={cx + fr * 1.02} y={cy - fr * 1.18}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={s * 0.055} fill="rgba(180,200,255,0.7)"
            fontWeight="bold"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.44 }}
          >?</motion.text>
        </g>
      )}

      {/* Excited sparkles */}
      {emotion === 'excited' && (
        <g>
          {[
            { x: cx - fr * 1.05, y: cy - fr * 0.75, delay: 0,    size: s * 0.038 },
            { x: cx + fr * 1.08, y: cy - fr * 0.85, delay: 0.28, size: s * 0.03  },
            { x: cx - fr * 0.75, y: cy - fr * 1.18, delay: 0.55, size: s * 0.025 },
            { x: cx + fr * 0.65, y: cy - fr * 1.12, delay: 0.18, size: s * 0.032 },
          ].map((sp, i) => (
            <motion.g key={i}
              animate={{ opacity: [0, 1, 0], scale: [0.4, 1.1, 0.4], y: [sp.y, sp.y - s * 0.04, sp.y] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: sp.delay }}
            >
              {/* 4-point star */}
              <path
                d={`M ${sp.x} ${sp.y - sp.size}
                    L ${sp.x + sp.size * 0.22} ${sp.y - sp.size * 0.22}
                    L ${sp.x + sp.size} ${sp.y}
                    L ${sp.x + sp.size * 0.22} ${sp.y + sp.size * 0.22}
                    L ${sp.x} ${sp.y + sp.size}
                    L ${sp.x - sp.size * 0.22} ${sp.y + sp.size * 0.22}
                    L ${sp.x - sp.size} ${sp.y}
                    L ${sp.x - sp.size * 0.22} ${sp.y - sp.size * 0.22} Z`}
                fill="#FFD700" opacity={0.9}
              />
            </motion.g>
          ))}
        </g>
      )}

      {/* Listening sound arcs */}
      {isListening && (
        <g>
          {[1, 2, 3].map(i => (
            <motion.path key={i}
              d={`M ${cx - fr * 1.1} ${cy - fr * 0.18 * i}
                  Q ${cx - fr * 1.28} ${cy}
                  ${cx - fr * 1.1} ${cy + fr * 0.18 * i}`}
              fill="none"
              stroke="#3B6FD4"
              strokeWidth={s * 0.009}
              strokeLinecap="round"
              animate={{ opacity: [0.7, 0.1, 0.7], strokeWidth: [s * 0.009, s * 0.005, s * 0.009] }}
              transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
            />
          ))}
        </g>
      )}

      {/* Encouraging heart */}
      {emotion === 'encouraging' && (
        <motion.g
          animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${cx + fr * 1.1}px ${cy - fr * 0.9}px` }}
        >
          <path
            d={`M ${cx + fr * 1.1} ${cy - fr * 0.78}
                C ${cx + fr * 1.1} ${cy - fr * 0.95} ${cx + fr * 0.88} ${cy - fr * 1.05} ${cx + fr * 0.88} ${cy - fr * 0.88}
                C ${cx + fr * 0.88} ${cy - fr * 1.05} ${cx + fr * 1.1} ${cy - fr * 1.05} ${cx + fr * 1.1} ${cy - fr * 0.88}
                C ${cx + fr * 1.1} ${cy - fr * 1.05} ${cx + fr * 1.32} ${cy - fr * 1.05} ${cx + fr * 1.32} ${cy - fr * 0.88}
                C ${cx + fr * 1.32} ${cy - fr * 1.05} ${cx + fr * 1.1} ${cy - fr * 0.95} ${cx + fr * 1.1} ${cy - fr * 0.78} Z`}
            fill="#FF6B8A"
          />
        </motion.g>
      )}

      {/* Surprised sweat drop */}
      {emotion === 'surprised' && (
        <motion.g
          animate={{ y: [0, s * 0.015, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ellipse
            cx={cx + fr * 0.88} cy={cy - fr * 0.55}
            rx={s * 0.018} ry={s * 0.028}
            fill="#7EC8E3" opacity={0.8}
          />
          <path
            d={`M ${cx + fr * 0.88} ${cy - fr * 0.55 - s * 0.028}
                Q ${cx + fr * 0.88 + s * 0.012} ${cy - fr * 0.55 - s * 0.048}
                ${cx + fr * 0.88} ${cy - fr * 0.55 - s * 0.055}`}
            fill="#7EC8E3" opacity={0.8}
          />
        </motion.g>
      )}
    </>
  );
}
