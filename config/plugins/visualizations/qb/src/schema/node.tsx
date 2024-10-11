/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { ArrowLeft, ArrowRight, CircleAlert, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { FormEvent, useMemo, useRef, useState } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { EDGE_TYPES, NODE_SCHEMA } from "./schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

const Forms: any = {
  gene: GeneForm,
  protein: ProteinForm,
  transcript: TranscriptForm,
  exon: ExonForm,
  snp: SNPForm,
  sv: SVForm,
  enhancer: LocationInputs,
  super_enhancer: LocationInputs,
  promoter: LocationInputs,
  ncrna: NCRNAForm,
  pathway: PathwayForm,
  go: GOForm,
  motif: MotifForm,
  cl: CLForm,
  clo: CLOForm,
  efo: EFOForm,
  bto: BTOForm,
  uberon: UberonForm,
};

function LocationInputs({ formData }: any) {
  const chromosomeOptions = useMemo(() => {
    const arr = new Array(22).fill(null);
    return ["X", "Y", ...arr.map((_, i) => i + 1)];
  }, []);

  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        Chr
        <Select name="chr" defaultValue={formData.chr}>
          <SelectTrigger className="mt-2 w-full">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            {chromosomeOptions.map((c) => (
              <SelectItem key={c} value={c.toString()}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Start
        <Input
          type="number"
          name="start"
          defaultValue={formData.start}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        End
        <Input
          type="number"
          name="end"
          defaultValue={formData.end}
          className="mt-2"
        />
      </Label>
    </>
  );
}

function GeneForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        Name
        <Input
          name="gene_name"
          defaultValue={formData.gene_name}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Type
        <Input
          name="gene_type"
          defaultValue={formData.gene_type}
          className="mt-2"
        />
      </Label>
      <LocationInputs formData={formData} />
    </>
  );
}

function ProteinForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        Name
        <Input
          name="protein_name"
          defaultValue={formData.protein_name}
          className="mt-2"
        />
      </Label>
      <LocationInputs formData={formData} />
    </>
  );
}

function TranscriptForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        Gene name
        <Input
          name="gene_name"
          defaultValue={formData.gene_name}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Transcript name
        <Input
          name="transcript_name"
          defaultValue={formData.transcript_name}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Transcript ID
        <Input
          name="transcript_id"
          defaultValue={formData.transcript_id}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Transcript type
        <Input
          name="transcript_type"
          defaultValue={formData.transcript_type}
          className="mt-2"
        />
      </Label>
      <LocationInputs formData={formData} />
    </>
  );
}

function ExonForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        Gene ID
        <Input
          name="gene_id"
          defaultValue={formData.gene_id}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Transcript ID
        <Input
          name="transcript_id"
          defaultValue={formData.transcript_id}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Exon number
        <Input
          name="exon_number"
          defaultValue={formData.exon_number}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Exon ID
        <Input
          name="exon_id"
          defaultValue={formData.exon_id}
          className="mt-2"
        />
      </Label>
      <LocationInputs formData={formData} />
    </>
  );
}

function SNPForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        Ref
        <Input name="ref" defaultValue={formData.ref} className="mt-2" />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Alt
        <Input name="alt" defaultValue={formData.alt} className="mt-2" />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Caf_ref
        <Input
          name="caf_ref"
          defaultValue={formData.caf_ref}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Caf_alt
        <Input
          name="caf_alt"
          defaultValue={formData.caf_alt}
          className="mt-2"
        />
      </Label>
      <LocationInputs formData={formData} />
    </>
  );
}

function SVForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        Variant type
        <Input
          name="variant_type"
          defaultValue={formData.variant_type}
          className="mt-2"
        />
      </Label>
      <LocationInputs formData={formData} />
    </>
  );
}

function NCRNAForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        RNA type
        <Input
          name="rna_type"
          defaultValue={formData.rna_type}
          className="mt-2"
        />
      </Label>
      <LocationInputs formData={formData} />
    </>
  );
}

function PathwayForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        Name
        <Input
          name="pathway_name"
          defaultValue={formData.pathway_name}
          className="mt-2"
        />
      </Label>
    </>
  );
}

function GOForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        Term name
        <Input
          name="term_name"
          defaultValue={formData.term_name}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Subontology
        <Input
          name="subontology"
          defaultValue={formData.subontology}
          className="mt-2"
        />
      </Label>
    </>
  );
}

function MotifForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        Name
        <Input
          name="tf_name"
          defaultValue={formData.tf_name}
          className="mt-2"
        />
      </Label>
    </>
  );
}

function UberonForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        ID
        <Input
          name="uberon_id"
          defaultValue={formData.uberon_id}
          className="mt-2"
        />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Name
        <Input
          name="uberon_name"
          defaultValue={formData.uberon_name}
          className="mt-2"
        />
      </Label>
    </>
  );
}

function CLOForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        ID
        <Input name="clo_id" defaultValue={formData.clo_id} className="mt-2" />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Name
        <Input
          name="clo_name"
          defaultValue={formData.clo_name}
          className="mt-2"
        />
      </Label>
    </>
  );
}

function CLForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        ID
        <Input name="cl_id" defaultValue={formData.cl_id} className="mt-2" />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Name
        <Input
          name="cl_name"
          defaultValue={formData.cl_name}
          className="mt-2"
        />
      </Label>
    </>
  );
}

function EFOForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        ID
        <Input name="efo_id" defaultValue={formData.efo_id} className="mt-2" />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Name
        <Input
          name="efo_name"
          defaultValue={formData.efo_name}
          className="mt-2"
        />
      </Label>
    </>
  );
}

function BTOForm({ formData }: any) {
  return (
    <>
      <Label className="block w-full max-w-sm pb-4">
        ID
        <Input name="bto_id" defaultValue={formData.bto_id} className="mt-2" />
      </Label>
      <Label className="block w-full max-w-sm pb-4">
        Name
        <Input
          name="bto_name"
          defaultValue={formData.bto_name}
          className="mt-2"
        />
      </Label>
    </>
  );
}

function useNodeState(id: string, data: any) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formShown, toggleForm] = useState<boolean>(false);
  const [error, setError] = useState<string>(data.error);
  const { setNodes } = useReactFlow();

  const summary: { key: string; value: any }[] = useMemo(() => {
    const EXCLUDED_KEYS = ["type", "error", "viewOnly"];
    return data
      ? Object.keys(data)
          .filter((k) => !EXCLUDED_KEYS.includes(k) && data[k])
          .map((k) => ({ key: k, value: data[k] }))
      : [];
  }, [data]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    const values = Object.fromEntries(formData);
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...values } } : n,
      ),
    );
    toggleForm(false);
  }

  function deleteNode() {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  }

  return {
    formRef,
    toggleForm,
    deleteNode,
    formShown,
    error,
    summary,
    onSubmit,
  };
}

export default function Node(props: any) {
  const { id, data, onAddNode, viewOnly }: any = props;
  const {
    formRef,
    formShown,
    error,
    summary,
    toggleForm,
    onSubmit,
    deleteNode,
  } = useNodeState(id, data);

  const {
    name,
    icon: Icon,
    iconWrapperClass,
    summaryWrapperClass,
    formHeaderClass,
  } = NODE_SCHEMA[data.type].props;

  const _iconWrapperClass = `text-white w-24 h-24 flex justify-center items-center text-base border-none rounded-full z-50 ${iconWrapperClass}`;
  const _summaryWrapperClass = ` p-2 text-xs absolute rounded-xl left-3/4 bottom-3/4 whitespace-nowrap border-4 border-background font-mono px-4 ${summaryWrapperClass}`;
  const _formHeaderClass = `-m-px p-4 text-white rounded-t ${formHeaderClass}`;

  const handleStyle = {
    width: 15,
    height: 15,
    zIndex: 99,
  };

  const availableConnections = useMemo(() => {
    const edgs = EDGE_TYPES.filter(
      (e) => e.source === data.type || e.target === data.type,
    );
    return edgs.map((e) => ({
      ...e,
      newNode: e.source === data.type ? e.target : e.source,
    }));
  }, []);

  const EdgeSelector = () => (
    <>
      <h4 className="m-4 text-sm font-bold">Available connections</h4>
      <ul>
        {availableConnections.map((e) => {
          const nodeType = NODE_SCHEMA[e.newNode]?.props;
          if (!nodeType) return;
          return (
            <li key={e.label} className="connections">
              <button className="relation" onClick={() => onAddNode(id, e.label)}>
                <div className="flex max-h-screen w-full items-center overflow-y-auto p-1 px-4 hover:cursor-pointer hover:bg-foreground/10 relation-li">
                  <div
                    className={`me-2 inline-flex h-10 w-10 items-center justify-center rounded-full ${nodeType.iconWrapperClass} text-background`}
                  >
                    <nodeType.icon />
                  </div>
                  <span>
                    {e.newNode}
                    {e.newNode === e.source ? (
                      <ArrowRight className="mx-1 inline stroke-slate-400" />
                    ) : (
                      <ArrowLeft className="mx-1 inline stroke-slate-400" />
                    )}
                    {e.label}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );

  const F = Forms[data.type];

  return (
    <div className="text-center">
      <div className="relative flex flex-col items-center justify-center text-start">
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <Handle
                type="target"
                position={Position.Left}
                style={handleStyle}
              />
            </PopoverTrigger>
            <PopoverContent
              hidden={viewOnly}
              side="left"
              className="w-full p-0 shadow-xl"
            >
              <EdgeSelector />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Handle
                type="source"
                position={Position.Right}
                style={handleStyle}
              />
            </PopoverTrigger>
            <PopoverContent
              hidden={viewOnly}
              side="right"
              className="w-full p-0 shadow-xl"
            >
              <EdgeSelector />
            </PopoverContent>
          </Popover>
          {error && (
            <div className="absolute left-3/4 top-3/4 rounded-full border-4 border-background bg-red-500 text-background">
              <CircleAlert size={24} />
            </div>
          )}
          <Popover
            open={formShown}
            onOpenChange={toggleForm}
            defaultOpen={true}
          >
            <PopoverTrigger>
              <div className={_iconWrapperClass}>
                <Icon size={48} />
              </div>
            </PopoverTrigger>
            <PopoverContent
              hidden={viewOnly}
              side="right"
              className="border-none bg-transparent p-0 shadow-none popover-content"
              onPointerDownOutside={() => toggleForm(false)}
            >
              <div className="rounded-b border border-border bg-card p-0 shadow-2xl">
                <div className={_formHeaderClass}>
                  <p>{name} properties</p>
                </div>
                {error && (
                  <div className="mt-4 px-4">
                    <Alert variant="destructive">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </div>
                )}
                {F ? (
                  <form ref={formRef} onSubmit={onSubmit}>
                    <div className="p-4">
                      <F formData={data} />
                    </div>
                    <div className="flex justify-end border-t p-4 text-end">
                      <Button
                        variant="outline"
                        className="mx-2"
                        type="button"
                        onClick={() => toggleForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                ) : (
                  <p className="p-4 text-slate-500">
                    There are no properties for this node.
                  </p>
                )}
              </div>
              <div className="mt-4 text-xs">
                <Button
                  variant="link"
                  className="delete-button"
                  onClick={deleteNode}
                >
                  <Trash2 size={18} className="me-2 inline" /> Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {summary.length > 0 && (
          <div className={_summaryWrapperClass}>
            <ul>
              {summary.map((p) => (
                <li key={p.key}>
                  {p.key}: {p.value}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-3">{data.label || data.name || name}</p>
      </div>
    </div>
  );
}
