import React, { useState, useEffect } from "react";
import { useSigma, useRegisterEvents } from "@react-sigma/core";

export default function Sidebar() {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const [selected, setSelected] = useState<string | null>(null);

  const registerEvents = useRegisterEvents();

  useEffect(() => {
    registerEvents({
      clickNode: ({ node }) => setSelected(node),
      clickStage: () => setSelected(null)
    });
  }, [registerEvents]);

  if (!selected) return null;

  const label = graph.getNodeAttribute(selected, "label");
  const color = graph.getNodeAttribute(selected, "color");

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: 260,
        height: "100%",
        background: "white",
        padding: 20,
        borderLeft: "1px solid #ddd",
        overflowY: "auto",
        zIndex: 10
      }}
    >
      <h3 style={{ color }}>{label}</h3>

      {/* TODO: Add astrology attributes here */}
      <p>Node ID: {selected}</p>
      <p>Element: {graph.getNodeAttribute(selected, "element")}</p>
      <p>Group: {graph.getNodeAttribute(selected, "group")}</p>
      <p>Description: {graph.getNodeAttribute(selected, "description")}</p>
    </div>
  );
}
