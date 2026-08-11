import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssemblyTree } from './AssemblyTree';
import { type AssemblyNode, filterAssemblyTree } from './assemblyUtils';

const mockNodes: AssemblyNode[] = [
  {
    id: 'root-1',
    name: 'Engine Assembly',
    type: 'assembly',
    children: [
      { id: 'p1', name: 'Piston Head', type: 'part' },
      { id: 'p2', name: 'Connecting Rod', type: 'part' },
    ],
  },
  {
    id: 'p3',
    name: 'Crankshaft',
    type: 'part',
  },
];

describe('filterAssemblyTree logic', () => {
  it('returns all nodes when query is empty', () => {
    const res = filterAssemblyTree(mockNodes, '');
    expect(res).toHaveLength(2);
  });

  it('filters nodes matching direct name or child name', () => {
    const res = filterAssemblyTree(mockNodes, 'Piston');
    expect(res).toHaveLength(1);
    expect(res[0].name).toBe('Engine Assembly');
    expect(res[0].children).toHaveLength(1);
    expect(res[0].children![0].name).toBe('Piston Head');
  });

  it('returns empty array when no matches found', () => {
    const res = filterAssemblyTree(mockNodes, 'NonExistentItem');
    expect(res).toHaveLength(0);
  });
});

describe('AssemblyTree component', () => {
  it('renders node hierarchy correctly', () => {
    render(
      <AssemblyTree
        nodes={mockNodes}
        selectedId={null}
        hiddenIds={new Set()}
        isolatedId={null}
        onSelectNode={vi.fn()}
        onToggleVisibility={vi.fn()}
        onToggleIsolate={vi.fn()}
      />
    );

    expect(screen.getByText('Engine Assembly')).toBeTruthy();
    expect(screen.getByText('Piston Head')).toBeTruthy();
    expect(screen.getByText('Connecting Rod')).toBeTruthy();
    expect(screen.getByText('Crankshaft')).toBeTruthy();
  });

  it('triggers onSelectNode when a node row is clicked', () => {
    const onSelect = vi.fn();
    render(
      <AssemblyTree
        nodes={mockNodes}
        selectedId={null}
        hiddenIds={new Set()}
        isolatedId={null}
        onSelectNode={onSelect}
        onToggleVisibility={vi.fn()}
        onToggleIsolate={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Piston Head'));
    expect(onSelect).toHaveBeenCalledWith('p1');
  });

  it('triggers visibility and isolate callbacks', () => {
    const onVis = vi.fn();
    const onIso = vi.fn();
    render(
      <AssemblyTree
        nodes={mockNodes}
        selectedId={null}
        hiddenIds={new Set()}
        isolatedId={null}
        onSelectNode={vi.fn()}
        onToggleVisibility={onVis}
        onToggleIsolate={onIso}
      />
    );

    const visBtn = screen.getByRole('button', { name: 'visibility-p1' });
    fireEvent.click(visBtn);
    expect(onVis).toHaveBeenCalledWith('p1');

    const isoBtn = screen.getByRole('button', { name: 'isolate-p1' });
    fireEvent.click(isoBtn);
    expect(onIso).toHaveBeenCalledWith('p1');
  });

  it('filters assembly nodes live as user types in search input', () => {
    render(
      <AssemblyTree
        nodes={mockNodes}
        selectedId={null}
        hiddenIds={new Set()}
        isolatedId={null}
        onSelectNode={vi.fn()}
        onToggleVisibility={vi.fn()}
        onToggleIsolate={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('Search components...');
    fireEvent.change(input, { target: { value: 'Crank' } });

    expect(screen.getByText('Crankshaft')).toBeTruthy();
    expect(screen.queryByText('Engine Assembly')).toBeNull();
  });
});
