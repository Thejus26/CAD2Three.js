import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { SceneMemoryAuditor } from './memoryAuditor';

describe('SceneMemoryAuditor', () => {
  let auditor: SceneMemoryAuditor;

  beforeEach(() => {
    auditor = new SceneMemoryAuditor();
  });

  it('tracks geometry and material allocations from Object3D', () => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial()
    );

    auditor.trackObject(mesh);
    const report = auditor.getReport();

    expect(report.webglGeometries).toBe(1);
    expect(report.estimatedMemoryBytes).toBeGreaterThan(0);
    expect(report.activeOccHandles).toBe(0);
  });

  it('disposes all registered Three.js resources and resets memory count', () => {
    const box = new THREE.BoxGeometry(2, 2, 2);
    const mat = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(box, mat);

    auditor.trackObject(mesh);
    expect(auditor.getReport().webglGeometries).toBe(1);

    auditor.disposeAll();
    expect(auditor.getReport().webglGeometries).toBe(0);
  });

  it('audits sequential loading and cleaning of 50 models without residual leaks', () => {
    for (let i = 0; i < 50; i++) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(i + 1, 1, 1),
        new THREE.MeshBasicMaterial()
      );
      auditor.trackObject(mesh);

      // Clean scene after each load
      auditor.disposeAll();
    }

    const finalReport = auditor.getReport();
    expect(finalReport.webglGeometries).toBe(0);
    expect(finalReport.estimatedMemoryBytes).toBe(0);
  });
});
