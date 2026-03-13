import { useEffect } from "react";
import { useSigma } from "@react-sigma/core";

interface FocusOnNodeProps {
  node: string | null;
  move?: boolean;      // if false → do not animate camera
  ratio?: number;      // zoom level
  duration?: number;   // animation duration
}

export function FocusOnNode({
  node,
  move = true,
  ratio = 0.4,
  duration = 600,
}: FocusOnNodeProps) {
  const sigma = useSigma();

  useEffect(() => {
    if (!node || !move) return;

    const pos = sigma.getNodeDisplayData(node);
    if (!pos) return;

    sigma.getCamera().animate(
      { x: pos.x, y: pos.y, ratio },
      { duration }
    );
  }, [node, move, ratio, duration, sigma]);

  return null;
}

