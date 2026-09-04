import { KernelMark } from "@/components/kernel/logo";

const faces = [
  { label: "macOS", ry: 0 },
  { label: "Windows", ry: 90 },
  { label: "Linux", ry: 180 },
  { label: "Web", ry: 270 },
];

const SIZE = 168;

/** Slowly rotating CSS 3D cube; each face names a place Kernel runs. */
export function KernelCube() {
  return (
    <div className="scene-3d flex items-center justify-center py-6">
      <div
        className="cube-spin relative"
        style={{ width: SIZE, height: SIZE, transformStyle: "preserve-3d" }}
      >
        {faces.map((f) => (
          <div
            key={f.label}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card/70 backdrop-blur-sm"
            style={{ transform: `rotateY(${f.ry}deg) translateZ(${SIZE / 2}px)` }}
          >
            <KernelMark className="h-6 w-6 opacity-70" />
            <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
              {f.label}
            </span>
          </div>
        ))}
        <div
          aria-hidden
          className="paper-grid absolute inset-0 rounded-xl border border-border bg-card/60"
          style={{ transform: `rotateX(90deg) translateZ(${SIZE / 2}px)` }}
        />
        <div
          aria-hidden
          className="paper-grid absolute inset-0 rounded-xl border border-border bg-card/60"
          style={{ transform: `rotateX(-90deg) translateZ(${SIZE / 2}px)` }}
        />
      </div>
    </div>
  );
}
