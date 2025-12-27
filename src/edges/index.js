// edges/index.js - Edge type registry
import { SignalEdge } from './SignalEdge';

export const edgeTypes = {
  signal: SignalEdge,
};

export { SignalEdge } from './SignalEdge';
export { useEdgeSignal } from './useEdgeSignal';
