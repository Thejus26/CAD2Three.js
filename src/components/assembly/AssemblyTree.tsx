import React from 'react';
import { type AssemblyNode, filterAssemblyTree } from './assemblyUtils';

export interface AssemblyTreeProps {
  nodes: AssemblyNode[];
  selectedId: string | null;
  hiddenIds: Set<string>;
  isolatedId: string | null;
  onSelectNode: (id: string | null) => void;
  onToggleVisibility: (id: string) => void;
  onToggleIsolate: (id: string) => void;
}

export function AssemblyTree({
  nodes,
  selectedId,
  hiddenIds,
  isolatedId,
  onSelectNode,
  onToggleVisibility,
  onToggleIsolate,
}: AssemblyTreeProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredNodes = React.useMemo(
    () => filterAssemblyTree(nodes, searchQuery),
    [nodes, searchQuery]
  );

  const renderNode = (node: AssemblyNode, depth: number = 0) => {
    const isSelected = selectedId === node.id;
    const isHidden = hiddenIds.has(node.id);
    const isIsolated = isolatedId === node.id;

    return (
      <div key={node.id} data-testid={`node-${node.id}`}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 10px',
            paddingLeft: `${10 + depth * 16}px`,
            background: isSelected ? 'rgba(137, 180, 250, 0.2)' : 'transparent',
            borderRadius: '4px',
            cursor: 'pointer',
            color: isHidden ? '#6c7086' : '#cdd6f4',
            margin: '2px 0',
            transition: 'background 0.2s ease',
          }}
          onClick={() => onSelectNode(node.id)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.85rem' }}>
              {node.type === 'assembly' ? '📁' : '⚙️'}
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              {node.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
            <button
              aria-label={`visibility-${node.id}`}
              onClick={() => onToggleVisibility(node.id)}
              style={{
                background: 'none',
                border: 'none',
                color: isHidden ? '#6c7086' : '#a6adc8',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '2px 4px',
              }}
              title={isHidden ? 'Show Part' : 'Hide Part'}
            >
              {isHidden ? '👁️‍🗨️' : '👁️'}
            </button>

            <button
              aria-label={`isolate-${node.id}`}
              onClick={() => onToggleIsolate(node.id)}
              style={{
                background: isIsolated ? '#fab387' : 'transparent',
                border: 'none',
                borderRadius: '3px',
                color: isIsolated ? '#11111b' : '#a6adc8',
                cursor: 'pointer',
                fontSize: '0.75rem',
                padding: '2px 6px',
                fontWeight: 600,
              }}
              title={isIsolated ? 'Exit Isolate' : 'Isolate Part'}
            >
              {isIsolated ? 'Isolating' : 'Isolate'}
            </button>
          </div>
        </div>

        {node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#181825',
        color: '#cdd6f4',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        width: '280px',
        userSelect: 'none',
      }}
    >
      <div style={{ padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#cdd6f4' }}>Assembly Hierarchy</h3>
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search components"
          style={{
            width: '100%',
            padding: '6px 10px',
            background: '#313244',
            border: '1px solid #45475a',
            borderRadius: '4px',
            color: '#cdd6f4',
            fontSize: '0.85rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {filteredNodes.length > 0 ? (
          filteredNodes.map((node) => renderNode(node, 0))
        ) : (
          <div style={{ padding: '12px', color: '#a6adc8', fontSize: '0.85rem', textAlign: 'center' }}>
            No components match search
          </div>
        )}
      </div>
    </div>
  );
}
