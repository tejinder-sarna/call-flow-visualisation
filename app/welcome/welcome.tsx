import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { useState } from "react";
import palette from "~/constants/palette";
import "./welcome.css";

type dataProp = {
  label: string;
  subTitle?: string;
  error?: string;
  disabled?: boolean;
};

type Prop = {
  data: dataProp;
};

const CustomNode = ({ data }: Prop) => {
  const { label, subTitle, error, disabled } = data || {};
  const hasError = error !== undefined;
  return (
    <div
      style={{
        minWidth: 200,
        minHeight: 60,
        backgroundColor: palette.white,
        borderRadius: 8,
        borderWidth: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderColor: hasError ? palette.red : palette.light_grey,
        padding: 16,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <span>{label}</span>
      {subTitle && <span className="text-xs text-gray-400">{subTitle}</span>}
      {hasError && (
        <span className="text-xs text-red-500">{`Error: ${error}`}</span>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export function Welcome() {
  const { fitView } = useReactFlow();

  const [configuration, setConfiguration] = useState(
    CONFIGURATION as ConfigurationType
  );
  const config = new Configuration(configuration);
  const { nodes, edges } = config.nodesAndEdges;

  return (
    <div className="flow_diagram">
      <div className="flow_chart">
        <ReactFlow
          nodes={nodes}
          nodesConnectable={false}
          nodeTypes={nodeTypes}
          edges={edges}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div className="configuration_form">
        <ConfigurationForm
          configuration={config}
          setConfiguration={(data) => {
            setConfiguration(data);
            fitView({
              duration: 800,
            });
          }}
        />
      </div>
    </div>
  );
}

const DEMO_ASSIGNEES = ["Manuk", "Tejinder"];
const DEMO_MANAGERS = ["Manuk", "Tejinder", "Saxon"];
const DEMO_CALL_FORWARDING_NUMBER = "+918851641823";
const DEMO_SEQ_CALL_NUMBERS = [
  "+918851641813",
  "+918851641853",
  "+918851641822",
];

const OFFSET = 150;

const CONFIGURATION = {
  assignees: DEMO_ASSIGNEES,
  managers: DEMO_MANAGERS,
  areManagersAllowedToGetCall: true,
  isPhoneTreeEnabled: false,
  isCallForwardingEnabled: false,
  isCallRecordingEnabled: false,
  isSequentialCallEnabled: false,
  isSipEnabled: false,
  sequentialCallNumbers: [],
  forwardTo: "",
};

type ConfigurationType = {
  assignees: string[];
  managers: string[];
  areManagersAllowedToGetCall: boolean;
  isPhoneTreeEnabled: boolean;
  isCallForwardingEnabled: boolean;
  isCallRecordingEnabled: boolean;
  isSequentialCallEnabled: boolean;
  isSipEnabled: boolean;
  sequentialCallNumbers: string[];
  forwardTo: string;
};

type ConfigurationProps = {
  configuration: Configuration;
  setConfiguration: (configuration: Configuration) => void;
};

function ConfigurationForm({
  configuration,
  setConfiguration,
}: ConfigurationProps) {
  return (
    <div className="m-4">
      <form>
        <div className="mb-2">
          <label className="font-bold">Assignees</label>
          <div className="flex flex-row gap-2 items-center">
            <p>
              {configuration.hasAssignees
                ? configuration.assignees.join(", ")
                : "No Assignees"}
            </p>
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-300  py-1 px-2 rounded cursor-pointer text-white"
              onClick={() => {
                if (configuration.hasAssignees) {
                  configuration.removeAssignees();
                } else {
                  configuration.addAssignees();
                }
                setConfiguration(configuration);
              }}
            >
              {configuration.hasAssignees
                ? "Remove Assignees"
                : "Add Assignees"}
            </button>
          </div>
        </div>
        <div className="mb-2">
          <label className="font-bold">Managers</label>
          <div className="flex flex-row gap-2 items-center">
            <p>
              {configuration.hasManagers
                ? configuration.managers.join(", ")
                : "No Managers"}
            </p>
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-300 py-1 px-2 rounded cursor-pointer text-white"
              onClick={() => {
                if (configuration.hasManagers) {
                  configuration.removeManagers();
                } else {
                  configuration.addManagers();
                }
                setConfiguration(configuration);
              }}
            >
              {configuration.hasManagers ? "Remove Managers" : "Add Managers"}
            </button>
          </div>
          <p className="gap-2 flex flex-row items-center">
            <input
              type="checkbox"
              checked={configuration.areManagersAllowedToGetCall}
              name="areManagersAllowedToGetCall"
              id="areManagersAllowedToGetCall"
              onChange={() => {
                configuration.toggleManagersAllowedToGetCall();
                setConfiguration(configuration);
              }}
            />
            <label htmlFor="areManagersAllowedToGetCall">
              Managers can get incoming calls
            </label>
          </p>
        </div>
        <div className="mb-2">
          <label className="font-bold ">Call Routing</label>
          <p
            className="mt-1"
            onChange={(e) => {
              switch (e.target.value) {
                case "phone-tree":
                  configuration.togglePhoneTreeEnabled();
                  break;
                case "call-forwarding":
                  configuration.toggleCallForwardingEnabled();
                  break;
                case "sequential-call":
                  configuration.toggleSequentialCallEnabled();
                  break;
                case "sip":
                  configuration.toggleSipEnabled();
                  break;
                default:
                  configuration.removeCallRouting();
                  break;
              }
              setConfiguration(configuration);
            }}
          >
            <select value={configuration.callRoutingType}>
              <option value="none">None</option>
              <option value="phone-tree">Phone Tree</option>
              <option value="call-forwarding">Call Forwarding</option>
              <option value="sequential-call">Sequential Call</option>
              <option value="sip">SIP</option>
            </select>
          </p>
          {configuration.isSequentialCallEnabled && (
            <div className="flex flex-row gap-2 items-center mt-2">
              {configuration.sequentialCallNumbers.length < 3 && (
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-300 py-1 px-2 rounded cursor-pointer text-white"
                  onClick={() => {
                    configuration.addSequentialCallNumber();
                    setConfiguration(configuration);
                  }}
                >
                  Add Seq Call Number
                </button>
              )}
              {configuration.sequentialCallNumbers.length > 0 && (
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-300 py-1 px-2 rounded cursor-pointer text-white"
                  onClick={() => {
                    configuration.removeSequentialCallNumber();
                    setConfiguration(configuration);
                  }}
                >
                  Remove Seq Call Number
                </button>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

class Configuration {
  assignees: string[] = CONFIGURATION.assignees;
  managers: string[] = CONFIGURATION.managers;
  areManagersAllowedToGetCall: boolean =
    CONFIGURATION.areManagersAllowedToGetCall;
  isPhoneTreeEnabled: boolean = CONFIGURATION.isPhoneTreeEnabled;
  isCallForwardingEnabled: boolean = CONFIGURATION.isCallForwardingEnabled;
  isCallRecordingEnabled: boolean = CONFIGURATION.isCallRecordingEnabled;
  isSequentialCallEnabled: boolean = CONFIGURATION.isSequentialCallEnabled;
  isSipEnabled: boolean = CONFIGURATION.isSipEnabled;
  sequentialCallNumbers: string[] = CONFIGURATION.sequentialCallNumbers;
  forwardTo: string = CONFIGURATION.forwardTo;

  constructor(data: ConfigurationType) {
    this.assignees = data.assignees;
    this.managers = data.managers;
    this.areManagersAllowedToGetCall = data.areManagersAllowedToGetCall;
    this.isPhoneTreeEnabled = data.isPhoneTreeEnabled;
    this.isCallForwardingEnabled = data.isCallForwardingEnabled;
    this.isCallRecordingEnabled = data.isCallRecordingEnabled;
    this.isSequentialCallEnabled = data.isSequentialCallEnabled;
    this.sequentialCallNumbers = data.sequentialCallNumbers;
    this.forwardTo = data.forwardTo;
    this.isSipEnabled = data.isSipEnabled;
  }

  get hasAssignees() {
    return this.assignees.length > 0;
  }

  get hasManagers() {
    return this.managers.length > 0;
  }

  get callRoutingType() {
    if (this.isPhoneTreeEnabled) {
      return "phone-tree";
    }
    if (this.isCallForwardingEnabled) {
      return "call-forwarding";
    }
    if (this.isSequentialCallEnabled) {
      return "sequential-call";
    }
    if (this.isSipEnabled) {
      return "sip";
    }
  }

  removeAssignees() {
    this.assignees = [];
  }

  removeManagers() {
    this.managers = [];
  }

  addAssignees() {
    if (this.assignees.length === 0) {
      this.assignees = DEMO_ASSIGNEES;
    }
  }
  addManagers() {
    if (this.managers.length === 0) {
      this.managers = DEMO_MANAGERS;
    }
  }

  toggleManagersAllowedToGetCall() {
    this.areManagersAllowedToGetCall = !this.areManagersAllowedToGetCall;
  }

  togglePhoneTreeEnabled() {
    if (!this.isPhoneTreeEnabled) {
      this.isCallForwardingEnabled = false;
      this.isSequentialCallEnabled = false;
      this.isSipEnabled = false;
    }
    this.isPhoneTreeEnabled = !this.isPhoneTreeEnabled;
  }

  toggleSipEnabled() {
    if (!this.isSipEnabled) {
      this.isCallForwardingEnabled = false;
      this.isSequentialCallEnabled = false;
      this.isPhoneTreeEnabled = false;
    }
    this.isSipEnabled = !this.isSipEnabled;
  }

  toggleCallForwardingEnabled() {
    if (!this.isCallForwardingEnabled) {
      this.isPhoneTreeEnabled = false;
      this.isSequentialCallEnabled = false;
      this.isSipEnabled = false;
      this.forwardTo = "+918851641823";
    }
    this.isCallForwardingEnabled = !this.isCallForwardingEnabled;
  }

  toggleSequentialCallEnabled() {
    if (!this.isSequentialCallEnabled) {
      this.isPhoneTreeEnabled = false;
      this.isCallForwardingEnabled = false;
      this.isSipEnabled = false;
    }
    this.isSequentialCallEnabled = !this.isSequentialCallEnabled;
    this.sequentialCallNumbers = [DEMO_SEQ_CALL_NUMBERS[0]];
  }

  addSequentialCallNumber() {
    if (
      this.isSequentialCallEnabled &&
      Array.isArray(this.sequentialCallNumbers)
    ) {
      const len = this.sequentialCallNumbers.length;
      if (Number.isInteger(len) && len < DEMO_SEQ_CALL_NUMBERS.length) {
        this.sequentialCallNumbers.push(DEMO_SEQ_CALL_NUMBERS[len]);
      }
    }
  }

  removeSequentialCallNumber() {
    if (
      this.isSequentialCallEnabled &&
      Array.isArray(this.sequentialCallNumbers)
    ) {
      const len = this.sequentialCallNumbers.length;
      if (Number.isInteger(len) && len > 0) {
        this.sequentialCallNumbers.pop();
      }
    }
  }

  removeCallRouting() {
    this.isPhoneTreeEnabled = false;
    this.isCallForwardingEnabled = false;
    this.isSequentialCallEnabled = false;
    this.isSipEnabled = false;
  }

  toggleCallRecordingEnabled() {
    this.isCallRecordingEnabled = !this.isCallRecordingEnabled;
  }

  get nodesAndEdges() {
    return convertToNodesAndEdges(this);
  }
}

class Node {
  id: string;
  position: { x: number; y: number };
  data: {
    label: string;
    subTitle?: string;
    error?: string;
    disabled?: boolean;
  };
  type: string;

  constructor(
    x: number,
    y: number,
    label: string,
    subTitle?: string,
    overrideY?: number,
    error?: string,
    disabled?: boolean
  ) {
    this.id = `${y}`;
    this.position = { x: x * OFFSET, y: (overrideY || y) * OFFSET };
    this.data = {
      label,
      subTitle,
      error,
      disabled,
    };
    this.type = "custom";
  }
}

const convertToNodesAndEdges = (configuration: Configuration | null) => {
  if (!configuration) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];

  let index = 0;
  let xIndex = 0;

  nodes.push(new Node(xIndex, index, "Incoming Call"));

  if (configuration.isCallRecordingEnabled) {
    index++;
    nodes.push(new Node(xIndex, index, "Call Recording Message"));
    edges.push({
      id: `e${index - 1}-${index}`,
      source: `${index - 1}`,
      target: `${index}`,
      animated: true,
    });
  }

  if (configuration.isCallForwardingEnabled) {
    index++;
    nodes.push(
      new Node(xIndex, index, "Call Forwarding", configuration.forwardTo)
    );
    edges.push({
      id: `e${index - 1}-${index}`,
      source: `${index - 1}`,
      target: `${index}`,
      animated: true,
    });

    return { nodes, edges };
  }

  if (configuration.isPhoneTreeEnabled) {
    index++;
    nodes.push(new Node(xIndex, index, "Phone Tree"));
    edges.push({
      id: `e${index - 1}-${index}`,
      source: `${index - 1}`,
      target: `${index}`,
      animated: true,
    });

    return { nodes, edges };
  }

  if (configuration.hasAssignees) {
    index++;
    nodes.push(
      new Node(
        configuration.hasManagers ? xIndex - 1 : xIndex,
        index,
        "Assignees",
        configuration.assignees.join(", ")
      )
    );
    edges.push({
      id: `e${index - 1}-${index}`,
      source: `${index - 1}`,
      target: `${index}`,
      animated: true,
    });
  }

  if (configuration.hasManagers) {
    index++;
    nodes.push(
      new Node(
        configuration.hasAssignees ? xIndex + 1 : xIndex,
        index,
        "Managers",
        configuration.managers.join(", "),
        configuration.hasAssignees ? index - 1 : index,
        undefined,
        !configuration.areManagersAllowedToGetCall
      )
    );
    edges.push({
      id: `e${index - (configuration.hasAssignees ? 2 : 1)}-${index}`,
      source: `${index - (configuration.hasAssignees ? 2 : 1)}`,
      target: `${index}`,
      animated: true,
      label: configuration.areManagersAllowedToGetCall ? "" : "X",
    });
  }

  if (configuration.isSipEnabled) {
    index++;
    const hasBothUsers =
      configuration.hasManagers && configuration.hasAssignees;
    nodes.push(
      new Node(xIndex, index, "SIP", "", hasBothUsers ? index - 1 : index)
    );
    if (hasBothUsers) {
      edges.push({
        id: `e${index - 2}-${index}`,
        source: `${index - 2}`,
        target: `${index}`,
        animated: true,
      });
      edges.push({
        id: `e${index - 1}-${index}`,
        source: `${index - 1}`,
        target: `${index}`,
        animated: true,
      });
    } else {
      edges.push({
        id: `e${index - 1}-${index}`,
        source: `${index - 1}`,
        target: `${index}`,
        animated: true,
      });
    }
    return { nodes, edges };
  }

  if (configuration.isSequentialCallEnabled) {
    index++;
    const hasBothUsers =
      configuration.hasManagers && configuration.hasAssignees;
    nodes.push(
      new Node(
        xIndex,
        index,
        "Sequential Call",
        "",
        hasBothUsers ? index - 1 : index,
        configuration.sequentialCallNumbers.length > 0
          ? undefined
          : "No Seq Call Numbers"
      )
    );

    if (hasBothUsers) {
      edges.push({
        id: `e${index - 2}-${index}`,
        source: `${index - 2}`,
        target: `${index}`,
        animated: true,
      });
      edges.push({
        id: `e${index - 1}-${index}`,
        source: `${index - 1}`,
        target: `${index}`,
        animated: true,
      });
    } else {
      edges.push({
        id: `e${index - 1}-${index}`,
        source: `${index - 1}`,
        target: `${index}`,
        animated: true,
      });
    }
    configuration.sequentialCallNumbers.forEach((number, i) => {
      const startingIndex = hasBothUsers ? index - 1 : index;
      const seqIndex = index + i + 1;
      nodes.push(
        new Node(
          xIndex,
          seqIndex,
          `Seq Call ${i + 1}`,
          number,
          startingIndex + i + 1
        )
      );
      edges.push({
        id: `e${seqIndex - 1}-${seqIndex}`,
        source: `${seqIndex - 1}`,
        target: `${seqIndex}`,
        animated: true,
      });
    });

    index += configuration.sequentialCallNumbers.length;
  }

  return { nodes, edges };
};
