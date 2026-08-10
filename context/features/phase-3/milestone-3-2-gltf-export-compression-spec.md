# Milestone 3.2: Mesh Compression & glTF/GLB Exporter Pipeline

## Overview
Develop a client-side mesh optimization, Draco compression, and glTF 2.0 export pipeline with local IndexedDB caching.

## Sub-tasks

### 3.2.1: glTF 2.0 / GLB Serialization
- [ ] Integrate Three.js `GLTFExporter`.
- [ ] Build exporter service supporting binary `.glb` download and embedded `.gltf`.

### 3.2.2: Mesh Simplification & Draco Compression
- [ ] Integrate `Draco3D` compressor for vertex/normal buffer quantization.
- [ ] Integrate `gltf-transform` / `meshoptimizer` for mesh decimation (LOD) and hardware instancing (`InstancedMesh`).

### 3.2.3: Local Caching Infrastructure
- [ ] Implement `IndexedDB` storage service using SHA-256 model file hashes to cache converted GLB buffers for instant subsequent loads.

## Acceptance Criteria
- [ ] User can export converted CAD scenes as compressed `.glb` files.
- [ ] Draco compression reduces file payload size by 70–80%.
- [ ] Previously loaded CAD files open instantly from IndexedDB cache.
