import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Film,
  Sparkles,
  ArrowRight,
  Upload,
  Cpu,
  Activity,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useIntro } from '../../hooks/useIntro';
import { soundEngine } from '../../utils/introAudio';

interface StarParticle {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
}

const TELEMETRY_LOGS = [
  'BOOT::INIT_FINSIGHT_CORE_v2.4',
  'NET::CONNECTING_SECURE_NODES (100%)',
  'LEDGER::SYNCING_TRANSACTIONS [COUNT: 300+]',
  'ANALYTICS::REVENUE_STREAM_OPTIMIZED [₹3.4L+]',
  'AI_NEURAL::ANOMALY_DETECTION_ACTIVE',
  'SYS::READY FOR DEPLOYMENT',
];

export function IntroModal() {
  const { isOpen, closeIntro, mode, setMode, videoUrl, setVideoUrl } = useIntro();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0); // 0: Init, 1: Warp, 2: Logo Reveal
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [customVideoSelected, setCustomVideoSelected] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Mouse parallax coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Handle exiting with cinematic zoom effect
  const handleExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    soundEngine.playLogoReveal();
    setTimeout(() => {
      closeIntro();
      setIsExiting(false);
    }, 600);
  }, [closeIntro, isExiting]);

  // Keyboard shortcut (Escape or Space to enter)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleExit]);

  // Step sequences & telemetry streaming
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      setActiveLogIndex(0);
      return;
    }

    // Sound riser
    soundEngine.playWarpRiser();

    // Step progression
    const step1Timer = setTimeout(() => {
      setCurrentStep(1); // Warp acceleration
    }, 1200);

    const step2Timer = setTimeout(() => {
      setCurrentStep(2); // Logo & Core reveal
      soundEngine.playLogoReveal();
    }, 2800);

    // Telemetry log typewriter interval
    const logInterval = setInterval(() => {
      setActiveLogIndex((prev) => {
        const next = prev + 1;
        if (next < TELEMETRY_LOGS.length) {
          soundEngine.playTelemetryTick();
          return next;
        }
        return prev;
      });
    }, 700);

    // Auto progress timer (6.5 seconds total)
    const duration = 6500;
    const intervalTime = 50;
    const increment = (intervalTime / duration) * 100;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          handleExit();
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen, handleExit]);

  // Audio mute toggle
  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Canvas Warp Tunnel & Constellation Engine
  useEffect(() => {
    if (!isOpen || mode !== 'motion') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.05;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.05;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Create 3D particles
    const particleCount = 280;
    const particles: StarParticle[] = [];
    const colors = ['#22d3ee', '#a78bfa', '#6366f1', '#38bdf8', '#34d399', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2 + 0.8,
      });
    }

    let speed = 4;

    const render = () => {
      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Clear with radial depth trail
      ctx.fillStyle = 'rgba(4, 7, 20, 0.28)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2 + mouseRef.current.x;
      const cy = height / 2 + mouseRef.current.y;

      // Accelerate speed based on step
      const targetSpeed = currentStep === 1 ? 26 : currentStep === 2 ? 8 : 4;
      speed += (targetSpeed - speed) * 0.05;

      // Draw perspective grid plane
      ctx.save();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.07)';
      ctx.lineWidth = 1;
      const gridSpacing = 60;
      const horizonY = cy + 120;

      for (let x = -width; x < width * 2; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(cx, horizonY);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();

      // Render star particles & streaks
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= speed;

        if (p.z <= 0) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 350 / p.z;
        const px = p.x * k + cx;
        const py = p.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const depthAlpha = Math.min(1, (1000 - p.z) / 400);
          const particleSize = p.size * k * 0.8;

          // If warp speed, draw light trails
          if (speed > 10) {
            const prevK = 350 / (p.z + speed * 1.6);
            const prevX = p.x * prevK + cx;
            const prevY = p.y * prevK + cy;

            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(px, py);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = Math.max(1, particleSize * 0.6);
            ctx.globalAlpha = depthAlpha * 0.8;
            ctx.stroke();
          }

          // Star point
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.6, particleSize), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = depthAlpha;
          ctx.shadowBlur = particleSize > 2 ? 10 : 0;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen, mode, currentStep]);

  // Custom Video file selector handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setVideoUrl(localUrl);
      setMode('video');
      setCustomVideoSelected(true);
    }
  };

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-[#040714] select-none text-white transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-110 filter blur-lg pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* ── Background: Canvas Motion Graphics or Video Clip ── */}
      {mode === 'motion' ? (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
            onError={() => {
              // If video fails to load, gracefully fall back to motion mode
              if (!customVideoSelected) {
                setMode('motion');
              }
            }}
          />
          {/* Subtle vignette over video */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-transparent to-[#040714]/80 pointer-events-none" />
        </div>
      )}

      {/* ── Cyber HUD Scanline & Noise Overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
          backgroundSize: '100% 3px, 4px 100%',
        }}
      />

      {/* ── Top Cyber HUD Bar ── */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 backdrop-blur-md bg-white/[0.02] border-b border-white/[0.08]">
        {/* System telemetry pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-neon-emerald animate-ping" />
            <span className="text-neon-cyan font-bold tracking-wider">FINSIGHT // OS</span>
            <span className="text-surface-400 hidden sm:inline">v2.4.0</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-surface-400">
            <Activity className="w-3.5 h-3.5 text-neon-violet animate-pulse" />
            <span>LATENCY: 0.4ms</span>
            <span className="text-surface-600">•</span>
            <span>NODES: 100% SYNC</span>
          </div>
        </div>

        {/* Top Right Controls: Sound, Mode Toggle, Skip */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              !isMuted
                ? 'bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan shadow-glow-cyan'
                : 'bg-white/[0.06] border-white/[0.1] text-surface-400 hover:text-white'
            }`}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-bounce" />}
            <span className="hidden sm:inline">{isMuted ? 'Sound Off' : 'Sound On'}</span>
          </button>

          {/* Mode Switch: Motion vs Video */}
          <div className="hidden sm:flex items-center bg-white/[0.06] p-0.5 rounded-xl border border-white/[0.1]">
            <button
              onClick={() => setMode('motion')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                mode === 'motion'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Motion FX
            </button>
            <button
              onClick={() => setMode('video')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                mode === 'video'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              <Film className="w-3 h-3" />
              Video Clip
            </button>
          </div>

          {/* Skip / Enter Button */}
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-neon-cyan text-white text-xs sm:text-sm font-semibold hover:shadow-glow transition-all active:scale-95"
          >
            <span>Enter App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Left Telemetry Stream (Desktop) ── */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 z-10 w-72 pointer-events-none font-mono">
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl space-y-3 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[11px] text-surface-400">
            <span className="flex items-center gap-1.5 text-neon-cyan font-bold">
              <Cpu className="w-3.5 h-3.5" />
              DIAGNOSTIC TELEMETRY
            </span>
            <span>SECURE</span>
          </div>

          <div className="space-y-1.5 text-[10px]">
            {TELEMETRY_LOGS.map((log, index) => (
              <div
                key={log}
                className={`transition-all duration-300 flex items-center gap-2 ${
                  index <= activeLogIndex
                    ? index === activeLogIndex
                      ? 'text-neon-cyan font-semibold translate-x-1'
                      : 'text-surface-400'
                    : 'opacity-20'
                }`}
              >
                <span className="text-neon-violet">{'>'}</span>
                <span className="truncate">{log}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.08] grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-surface-500 block">ENCRYPTION</span>
              <span className="text-neon-emerald font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> SHA-256
              </span>
            </div>
            <div>
              <span className="text-surface-500 block">AI INFERENCE</span>
              <span className="text-neon-violet font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> REAL-TIME
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Centerpiece: FinSight Emblem & Cinematic Typography ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 pointer-events-none">
        <div className="flex flex-col items-center max-w-xl text-center pointer-events-auto">
          {/* Multi-layered Glowing Gyroscope Rings */}
          <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
            {/* Outer Orbiting Ring */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-dashed border-neon-cyan/40 animate-spin-slow absolute inset-0 -m-3 sm:-m-4" />

            {/* Middle Violet Aura */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-neon-violet/30 animate-spin absolute" />

            {/* Radial Core Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand-500/40 via-neon-cyan/30 to-neon-rose/40 blur-2xl animate-pulse" />

            {/* Central FinSight 3D Emblem */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-brand-500 via-brand-600 to-neon-cyan rounded-3xl flex items-center justify-center shadow-glow-lg border border-white/20 transform hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 8h16M4 13h10M4 18h14" />
                <circle cx="19" cy="6" r="2.5" fill="currentColor" stroke="none" opacity="0.9" />
              </svg>
            </div>
          </div>

          {/* Cinematic Title & Tagline */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-xs font-mono text-neon-cyan tracking-widest backdrop-blur-sm uppercase">
              <Sparkles className="w-3 h-3 text-neon-cyan" />
              Next-Gen Financial Intelligence
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-2xl">
              FIN
              <span className="bg-gradient-to-r from-neon-cyan via-brand-400 to-neon-rose bg-clip-text text-transparent">
                SIGHT
              </span>
            </h1>

            <p className="text-sm sm:text-base text-surface-300 max-w-md mx-auto font-normal leading-relaxed">
              Real-time transaction forensics, automated revenue intelligence, and financial clarity.
            </p>
          </div>

          {/* Interactive Launch Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleExit}
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-neon-cyan text-white text-sm sm:text-base font-bold shadow-glow hover:shadow-glow-lg transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Launch FinSight</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {isMuted && (
              <button
                onClick={toggleSound}
                className="text-xs text-neon-cyan hover:text-white transition-colors flex items-center gap-1.5 px-3 py-2"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Click to Enable Audio
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Telemetry / Metric Preview (Desktop) ── */}
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-10 w-64 pointer-events-none font-mono">
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl space-y-3 shadow-2xl">
          <div className="text-[11px] text-surface-400 border-b border-white/[0.08] pb-2 font-bold text-neon-violet">
            LIVE ANALYTICS PREVIEW
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-surface-400">Total Revenue:</span>
              <span className="text-white font-bold">₹3,40,000+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-surface-400">Transactions:</span>
              <span className="text-neon-cyan font-bold">300 Live</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-surface-400">Integrity Check:</span>
              <span className="text-neon-emerald font-bold">100% Passed</span>
            </div>
          </div>

          {/* Mode switch helper & upload your video option */}
          <div className="pt-2 border-t border-white/[0.08] pointer-events-auto">
            <label className="flex items-center justify-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[10px] text-surface-300 hover:text-white cursor-pointer transition-colors">
              <Upload className="w-3 h-3 text-neon-cyan" />
              <span>Load Custom Video (.mp4)</span>
              <input type="file" accept="video/mp4,video/webm" onChange={handleVideoUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* ── Bottom HUD Footer & Progress Bar ── */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-20 flex flex-col gap-2">
        {/* Progress Bar */}
        <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-neon-cyan to-neon-violet transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-surface-400 font-mono">
          <div className="flex items-center gap-2">
            <span>PRESS [SPACE] OR [ESC] TO SKIP</span>
            {mode === 'video' && (
              <button
                onClick={toggleVideoPlayback}
                className="text-neon-cyan hover:underline flex items-center gap-1 ml-2"
              >
                {isVideoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isVideoPlaying ? 'Pause' : 'Play'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>AUTO-LAUNCHING IN {Math.max(0, Math.ceil((100 - progress) / 16.6))}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
