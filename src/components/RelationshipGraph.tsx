// USE: Lightweight self-contained SVG node-link diagram showing how the
// actor connects to aliases, PGP keys, wallets, sources, and other entities.
// No external graph library — plain SVG with a static radial layout.
// Hover a node to highlight its direct connections.

import { useMemo, useState } from "react";
import type {
  RelationshipGraphData,
  RelationshipNodeType,
} from "../data/types";

interface RelationshipGraphProps {
  data: RelationshipGraphData;
}

const typeColor: Record<RelationshipNodeType, string> = {
  actor: "#a1a1aa", // zinc-400
  alias: "#38bdf8", // sky-400
  pgp: "#71717a", // zinc-500
  wallet: "#34d399", // emerald-400
  source: "#fbbf24", // amber-400
  entity: "#f87171", // red-400
};

const typeLabel: Record<RelationshipNodeType, string> = {
  actor: "Actor",
  alias: "Alias",
  pgp: "PGP key",
  wallet: "Wallet",
  source: "Source",
  entity: "Connected entity",
};

const WIDTH = 720;
const HEIGHT = 420;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };
const RADIUS = 160;

export default function RelationshipGraph({ data }: RelationshipGraphProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const centerNode = data.nodes.find((n) => n.type === "actor");
    const orbit = data.nodes.filter((n) => n.id !== centerNode?.id);

    if (centerNode) map.set(centerNode.id, CENTER);

    orbit.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / Math.max(orbit.length, 1) - Math.PI / 2;
      map.set(node.id, {
        x: CENTER.x + RADIUS * Math.cos(angle),
        y: CENTER.y + RADIUS * Math.sin(angle),
      });
    });

    return map;
  }, [data.nodes]);

  const connectedIds = useMemo(() => {
    if (!hoveredId) return null;
    const ids = new Set<string>([hoveredId]);
    data.edges.forEach((e) => {
      if (e.sourceId === hoveredId) ids.add(e.targetId);
      if (e.targetId === hoveredId) ids.add(e.sourceId);
    });
    return ids;
  }, [hoveredId, data.edges]);

  return (
    <section className="rounded-2xl border border-slate-700/50 bg-[#111214]/70 backdrop-blur-xl p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-300">
          Relationship graph
        </h2>
        <div className="hidden sm:flex flex-wrap items-center gap-3">
          {(Object.keys(typeLabel) as RelationshipNodeType[]).map((type) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: typeColor[type] }}
                aria-hidden="true"
              />
              <span className="text-[11px] text-slate-500">
                {typeLabel[type]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full min-w-140"
          role="img"
          aria-label="Graph of relationships between the actor, aliases, keys, wallets, and connected entities"
        >
          {data.edges.map((edge, i) => {
            const from = positions.get(edge.sourceId);
            const to = positions.get(edge.targetId);
            if (!from || !to) return null;
            const dimmed =
              connectedIds &&
              !(
                connectedIds.has(edge.sourceId) &&
                connectedIds.has(edge.targetId)
              );
            return (
              <line
                key={`${edge.sourceId}-${edge.targetId}-${i}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={dimmed ? "#1e293b" : "#475569"}
                strokeWidth={1.5}
                className="transition-colors duration-200"
              />
            );
          })}

          {data.nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            const isCenter = node.type === "actor";
            const dimmed = connectedIds && !connectedIds.has(node.id);

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer transition-opacity duration-200"
                opacity={dimmed ? 0.35 : 1}
              >
                <circle
                  r={isCenter ? 26 : 18}
                  fill="#111214"
                  stroke={typeColor[node.type]}
                  strokeWidth={isCenter ? 2.5 : 2}
                />
                <circle
                  r={isCenter ? 26 : 18}
                  fill={typeColor[node.type]}
                  opacity={0.12}
                />
                <text
                  y={isCenter ? 42 : 34}
                  textAnchor="middle"
                  className="fill-slate-300 font-mono"
                  fontSize={isCenter ? 12 : 10.5}
                >
                  {node.label.length > 16
                    ? `${node.label.slice(0, 14)}…`
                    : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
