
import { ControlsContainer, FullScreenControl, SigmaContainer, ZoomControl } from "@react-sigma/core";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import Sidebar from "./Sidebar";
import { type FC, type CSSProperties, useState, useCallback } from "react";
import '@react-sigma/graph-search/lib/style.css';

import { GraphLoader } from "./GraphLoader";
// import FocusOnNode from "./FocusOnNode";
import { MiniMap } from "@react-sigma/minimap";
// import type { SerializedGraph } from "graphology-types";
import { GraphSearch, type GraphSearchOption } from "@react-sigma/graph-search";
// import Graph, { MultiDirectedGraph } from "graphology";
import { NodeImageProgram } from '@sigma/node-image';
import { FocusOnNode } from "./focusOnNode";
// import jsonGraph from "./data/vertices_helperstars_graphson.json";

  // Sigma settings
const sigmaSettings = {
  allowInvalidContainer: true,
  nodeProgramClasses: { image: NodeImageProgram },
  defaultNodeType: 'image',
  defaultEdgeType: 'arrow',
  labelDensity: 0.07,
  labelGridCellSize: 60,
  labelRenderedSizeThreshold: 15,
  labelFont: 'Lato, sans-serif',
  zIndex: true,
};

export const GraphView: FC<{ style: CSSProperties }> = ({ style }) => {
  // const graph = Graph.from(jsonGraph as SerializedGraph);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [focusNode, setFocusNode] = useState<string | null>(null);

  const onFocus = useCallback((value: GraphSearchOption | null) => {
    if (value === null) setFocusNode(null);
    else if (value.type === 'nodes') setFocusNode(value.id);
  }, []);
  const onChange = useCallback((value: GraphSearchOption | null) => {
    if (value === null) setSelectedNode(null);
    else if (value.type === 'nodes') setSelectedNode(value.id);
  }, []);
  const postSearchResult = useCallback((options: GraphSearchOption[]): GraphSearchOption[] => {
    return options.length <= 10
      ? options
      : [
          ...options.slice(0, 10),
          {
            type: 'message',
            message: <span className="text-center text-muted">And {options.length - 10} others</span>,
          },
        ];
  }, []);
  
  return <SigmaContainer style={style} settings={sigmaSettings}>
    <GraphLoader/>
      {/* <Sidebar /> */}
      <FocusOnNode node={focusNode ?? selectedNode} move={focusNode ? false : true} />
      <ControlsContainer position={'bottom-right'}>
        <ZoomControl />
        <FullScreenControl />
        <LayoutForceAtlas2Control />
      </ControlsContainer>
      <ControlsContainer position={'bottom-left'}>
        <MiniMap width="100px" height="100px" />
      </ControlsContainer>
      <ControlsContainer position={'top-right'}>
        <GraphSearch
          type="nodes"
          value={selectedNode ? { type: 'nodes', id: selectedNode } : null}
          onFocus={onFocus}
          onChange={onChange}
          postSearchResult={postSearchResult}
        />
      </ControlsContainer>
  </SigmaContainer>;
};
