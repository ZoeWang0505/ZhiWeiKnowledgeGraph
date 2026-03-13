import * as fs from "fs";

// -----------------------------
// 五行规则定义
// -----------------------------
const SHENG: Record<string, string> = {
  "木": "火",
  "火": "土",
  "土": "金",
  "金": "水",
  "水": "木"
};

const KE: Record<string, string> = {
  "木": "土",
  "火": "金",
  "土": "水",
  "金": "木",
  "水": "火"
};

// -----------------------------
// 类型定义
// -----------------------------
interface Vertex {
  id: string;
  label: string;
  properties: {
    name: string;
    category: string;
    element: string;
    yinyang: string;
    virtue: string;
    symbolism: string[];
    sign: string;
  };
}

interface Edge {
  id: string;
  label: string;
  outV: string;
  inV: string;
  properties?: Record<string, any>;
}

// -----------------------------
// 星曜组合关系（COMBO）
// -----------------------------
const COMBO_PAIRS: Record<string, { target: string; type: string }[]> = {
  "STAR_ZUOFU": [{ target: "STAR_YOUBI", type: "辅弼" }],
  "STAR_YOUBI": [{ target: "STAR_ZUOFU", type: "辅弼" }],

  "STAR_WENCHANG": [{ target: "STAR_WENQU", type: "文魁" }],
  "STAR_WENQU": [{ target: "STAR_WENCHANG", type: "文魁" }],

  "STAR_TIANRUI": [{ target: "STAR_TIANYUE", type: "魁钺" }],
  "STAR_TIANYUE": [{ target: "STAR_TIANRUI", type: "魁钺" }],

  "STAR_TIANXI": [{ target: "STAR_TIANYAO", type: "桃花" }],
  "STAR_TIANYAO": [{ target: "STAR_TIANXI", type: "桃花" }],

  "STAR_TIANSHANG": [{ target: "STAR_TIANXING", type: "刑伤" }],
  "STAR_TIANXING": [{ target: "STAR_TIANSHANG", type: "刑伤" }],

  "STAR_TIANWU": [{ target: "STAR_TIANYUE2", type: "灵感" }],
  "STAR_TIANYUE2": [{ target: "STAR_TIANWU", type: "灵感" }],

  "STAR_TIANCHU": [{ target: "STAR_TIANFU2", type: "福禄" }],
  "STAR_TIANFU2": [{ target: "STAR_TIANCHU", type: "福禄" }],

  "STAR_TIANGUAN": [{ target: "STAR_TIANGUI", type: "贵气" }],
  "STAR_TIANGUI": [{ target: "STAR_TIANGUAN", type: "贵气" }],

  "STAR_TIANCAI": [{ target: "STAR_TIANSHOU", type: "天赋延寿" }],
  "STAR_TIANSHOU": [{ target: "STAR_TIANCAI", type: "天赋延寿" }]
};

// -----------------------------
// 宫位节点（12 宫）
// -----------------------------
const PALACES = [
  "PALACE_MING",
  "PALACE_XIONGDI",
  "PALACE_FUQI",
  "PALACE_ZINV",
  "PALACE_CAIBO",
  "PALACE_JIEE",
  "PALACE_QIANYI",
  "PALACE_NUPU",
  "PALACE_GUANLU",
  "PALACE_TIANZHAI",
  "PALACE_FUDE",
  "PALACE_FUMU"
];

// -----------------------------
// 五行 edges
// -----------------------------
export function generateFiveElementEdges(vertices: Vertex[]): Edge[] {
  const edges: Edge[] = [];

  const byElement: Record<string, string[]> = {};
  for (const v of vertices) {
    const e = v.properties.element;
    if (!byElement[e]) byElement[e] = [];
    byElement[e].push(v.id);
  }

  for (const v of vertices) {
    const id = v.id;
    const element = v.properties.element;

    // 比
    const sameElements = byElement[element] || [];
    for (const target of sameElements) {
      if (target !== id) {
        edges.push({
          id: `EDGE_${id}_BI_${target}`,
          label: "BI",
          outV: id,
          inV: target
        });
      }
    }

    // 生
    const shengTarget = SHENG[element];
    if (shengTarget && byElement[shengTarget]) {
      for (const target of byElement[shengTarget]) {
        edges.push({
          id: `EDGE_${id}_SHENG_${target}`,
          label: "SHENG",
          outV: id,
          inV: target
        });
      }
    }

    // 克
    const keTarget = KE[element];
    if (keTarget && byElement[keTarget]) {
      for (const target of byElement[keTarget]) {
        edges.push({
          id: `EDGE_${id}_KE_${target}`,
          label: "KE",
          outV: id,
          inV: target
        });
      }
    }
  }

  return edges;
}

// -----------------------------
// 组合 edges
// -----------------------------
export function generateComboEdges(vertices: Vertex[]): Edge[] {
  const edges: Edge[] = [];

  for (const v of vertices) {
    const combos = COMBO_PAIRS[v.id];
    if (!combos) continue;

    for (const combo of combos) {
      edges.push({
        id: `EDGE_${v.id}_COMBO_${combo.target}`,
        label: "COMBO",
        outV: v.id,
        inV: combo.target,
        properties: { type: combo.type }
      });
    }
  }

  return edges;
}

// -----------------------------
// 落宫 edges
// -----------------------------
export function generatePalaceEdges(vertices: Vertex[]): Edge[] {
  const edges: Edge[] = [];

  vertices.forEach((v, index) => {
    // the modulo ensures we always get a valid entry from a non‑empty array
    const palace = PALACES[index % PALACES.length]!;

    edges.push({
      id: `EDGE_${v.id}_LOCATED_IN_${palace}`,
      label: "LOCATED_IN",
      outV: v.id,
      inV: palace
    });
  });

  return edges;
}

// -----------------------------
// 总入口：生成全部 edges
// -----------------------------
export function generateAllEdges(vertices: Vertex[]): Edge[] {
  return [
    ...generateFiveElementEdges(vertices),
    ...generateComboEdges(vertices),
    ...generatePalaceEdges(vertices)
  ];
}

// -----------------------------
// 写入文件
// -----------------------------
export function writeEdgesToFile(vertices: Vertex[], outputPath: string) {
  const edges = generateAllEdges(vertices);
  fs.writeFileSync(outputPath, JSON.stringify({ edges }, null, 2), "utf-8");
  console.log(`Edges written to ${outputPath}`);
}
