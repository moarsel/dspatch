import { Handle, Position, useNodeConnections } from '@xyflow/react';
import { useCallback } from 'react';

export function InletHandle({ id, ...props }) {
  const connections = useNodeConnections({ handleType: 'target', handleId: id });
  const isConnected = connections.length > 0;

  const isValidConnection = useCallback(() => {
    return connections.length < 1;
  }, [connections.length]);

  return (
    <Handle
      type="target"
      position={Position.Left}
      id={id}
      className={`handle inlet ${isConnected ? 'connected' : ''}`}
      isValidConnection={isValidConnection}
      {...props}
    />
  );
}
