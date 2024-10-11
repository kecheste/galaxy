/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Play, Plus } from "lucide-react";
import { Button } from "../ui/button"
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { getAllEdgesForNodesTypes, getEdgebyType, NODE_SCHEMA } from "../../schema/schema";
import { v4 as uuidv4 } from "uuid";
import CustomEdge from "../../schema/edge"
import CustomNode from "../../schema/node";

import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  useReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  Node as FlowNode,
  Edge,
  MarkerType,
  NodeTypes,
  XYPosition,
} from "@xyflow/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { useToast } from "../ui/use-toast";

const edgeTypes = {
  custom: CustomEdge,
};

export default function QueryBuilder({
  onSubmit,
  graph,
  viewOnly = false,
  ...props
}: any) {
  const { toast } = useToast();
  const reactFlowInstance = useRef<any>();
  const [nodes, setNodes] = useState<FlowNode<any>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { screenToFlowPosition, getNode, toObject } = useReactFlow();

  useEffect(() => {
    console.log({graph})
    const loadInitialGraph = async () => {
      if (graph) {
        setNodes(graph.nodes || []);
        setEdges(graph.edges || []);
      }
    };
    loadInitialGraph();
  }, []);

  const onAddNode = (currentNodeId: string, edgeType: string) => {
    const { position, data }: { position: XYPosition; data: any } =
      getNode(currentNodeId)!;
    const { source, target } = getEdgebyType(edgeType)!;
    const isCurrentNodeSource = source === data.type;
    const newNodeType = isCurrentNodeSource ? target : source;
    const newNodeId = uuidv4();
    const newNode = {
      id: newNodeId,
      type: "custom",
      data: {
        type: newNodeType,
      },
      position: screenToFlowPosition({
        x:
          position.x! +
          (300 + Math.random() * 200) * (isCurrentNodeSource ? 1 : -1),
        y: position.y! + Math.random() * 200 * (Math.random() > 0.5 ? 1 : -1),
      }),
    };
    setNodes((nds) => nds.concat(newNode));
    const newEdgeId = uuidv4();
    setEdges((eds) =>
      addEdge(
        {
          id: newEdgeId,
          source: isCurrentNodeSource ? currentNodeId : newNodeId,
          target: isCurrentNodeSource ? newNodeId : currentNodeId,
          type: "custom",
          data: {
            edgeType,
            options: getAllEdgesForNodesTypes(
              isCurrentNodeSource ? data.type : newNodeType,
              isCurrentNodeSource ? newNodeType : data.type,
            ),
          },
        },
        eds,
      ),
    );
    setTimeout(reactFlowInstance.current.fitView);
  };

  const parentNodeToChildrenMapping: { [k: string]: NodeProps[] } =
    useMemo(() => {
      const result: { [k: string]: NodeProps[] } = {};
      Object.values(NODE_SCHEMA).map((n) => {
        result[n.parent] = [...(result[n.parent] || []), n.props];
      });
      return result;
    }, []);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection: any) => {
      if (connection.source === connection.target) return;
      const source = nodes.find((n) => n.id === connection.source);
      const target = nodes.find((n) => n.id === connection.target);
      setEdges((eds) => {
        let edges = getAllEdgesForNodesTypes(
          source?.data.type!,
          target?.data.type!,
        );
        if (edges.length) {
          return addEdge(
            { ...connection, type: "custom", data: { options: edges } },
            eds,
          );
        }
        edges = getAllEdgesForNodesTypes(
          target?.data.type!,
          source?.data.type!,
        );
        if (edges.length) {
          return addEdge(
            {
              ...connection,
              source: connection.target,
              target: connection.source,
              type: "custom",
              data: { options: edges },
            },
            eds,
          );
        }
        toast({
          title: "Invalid connection.",
          description: "There are no valid connections between those nodes.",
          variant: "destructive",
        });
        return eds;
      });
    },
    [setEdges, nodes],
  );

  const nodeTypeToNodeComponentMapping: NodeTypes = useMemo(() => {
    const c = Object.keys(NODE_SCHEMA).reduce(
      (a, k) => ({ ...a, [k]: (NODE_SCHEMA as any)[k].node }),
      {},
    );
    return {
      ...c,
      custom: (props) => (
        <CustomNode {...props} viewOnly={viewOnly} onAddNode={onAddNode} />
      ),
    };
  }, []);

  return (
    <>
      <ReactFlow
        // colorMode={theme}
        className="react-flow"
        fitView
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypeToNodeComponentMapping}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(r) => (reactFlowInstance.current = r)}
        proOptions={{ hideAttribution: true }}
        fitViewOptions={{ padding: 0.5 }}
        defaultEdgeOptions={{
          animated: true,
          label: "relates",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "black",
          },
          style: {
            width: 5,
            borderWidth: 5,
            height: 5,
            strokeWidth: 2,
            strokeDasharray: "5,5",
          },
        }}
        {...props}
      >
        <Background gap={15} patternClassName="query-builder-bg-pattern" />
        <Controls className="controls" />
      </ReactFlow>
      {!viewOnly && (
        <Popover>
          <PopoverTrigger asChild className="absolute bottom-10 left-24">
            <Button variant={nodes.length > 0 ? "outline" : "default"} className="add-button">
              <Plus className="mr-2" /> Add node
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="p-0 shadow-2xl">
            <div className="rounded-t p-4 shadow">
              <h4 className="font-bold">Select a node type </h4>
            </div>
            <Accordion type="single" collapsible className="px-4">
              {Object.keys(parentNodeToChildrenMapping).map(
                (parent: string) => (
                  <AccordionItem key={parent} value={parent}>
                    <AccordionTrigger className="accordion-trigger button-trig">
                      <h5>{parent}</h5>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <ul>
                        {parentNodeToChildrenMapping[parent].map(
                          (nodeType: NodeProps) => (
                            <li key={nodeType.id} className="mb-2">
                              <Button
                                className="nodeChild"
                                variant="link"
                                onClick={() => {
                                  const newNode = {
                                    id: uuidv4(),
                                    type: "custom",
                                    data: {
                                      type: nodeType.id,
                                    },
                                    position: screenToFlowPosition({
                                      x: 100,
                                      y: 150,
                                    }),
                                  };
                                  setNodes((nds) => nds.concat(newNode));
                                }}
                              >
                                <div
                                  className={`me-2 inline-flex h-10 w-10 items-center justify-center rounded-full ${nodeType.iconWrapperClass} text-white`}
                                >
                                  <nodeType.icon />
                                </div>
                                {nodeType.name}
                              </Button>
                            </li>
                          ),
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ),
              )}
            </Accordion>
          </PopoverContent>
        </Popover>
      )}
      {nodes.length > 0 && !viewOnly && (
        <Button
          className="absolute bottom-10 right-24 run-button"
          onClick={() => onSubmit(toObject())}
        >
          <Play className="mr-2" /> Run query
        </Button>
      )}
    </>
  );
}
