import { Suspense, useRef, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useInView } from "framer-motion";
import ErrorBoundary from "../ErrorBoundary";

type Props = {
  children: ReactNode;
  cameraPos?: [number, number, number];
  fov?: number;
  className?: string;
};

export default function SceneCanvas({
  children,
  cameraPos = [0, 0, 8],
  fov = 45,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "200px" });

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 ${className}`}>
      <ErrorBoundary fallback={null}>
        {inView && (
          <Canvas
            camera={{ position: cameraPos, fov }}
            dpr={[1, 1.6]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener(
                "webglcontextlost",
                (e) => e.preventDefault(),
                false
              );
            }}
          >
            <Suspense fallback={null}>{children}</Suspense>
          </Canvas>
        )}
      </ErrorBoundary>
    </div>
  );
}
