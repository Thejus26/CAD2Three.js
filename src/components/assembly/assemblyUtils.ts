export interface AssemblyNode {
  id: string;
  name: string;
  type: 'assembly' | 'part';
  visible?: boolean;
  children?: AssemblyNode[];
}

/**
 * Recursively filters an assembly node tree based on a search query.
 */
export function filterAssemblyTree(nodes: AssemblyNode[], query: string): AssemblyNode[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return nodes;
  }

  const result: AssemblyNode[] = [];

  for (const node of nodes) {
    const isMatch = node.name.toLowerCase().includes(trimmed);

    let filteredChildren: AssemblyNode[] | undefined;
    if (node.children) {
      filteredChildren = filterAssemblyTree(node.children, trimmed);
    }

    const hasMatchingChildren = filteredChildren && filteredChildren.length > 0;

    if (isMatch || hasMatchingChildren) {
      result.push({
        ...node,
        children: filteredChildren,
      });
    }
  }

  return result;
}
