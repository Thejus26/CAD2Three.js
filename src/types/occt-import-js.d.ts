declare module 'occt-import-js' {
  export default function occtimportjs(options?: {
    locateFile?: (path: string) => string;
  }): Promise<{
    ReadStepFile: (
      content: Uint8Array,
      params: unknown
    ) => {
      success: boolean;
      meshes: Array<{
        name: string;
        color?: [number, number, number];
        attributes: {
          position: { array: number[] };
          normal?: { array: number[] };
        };
        index?: { array: number[] };
      }>;
    };
    ReadIgesFile: (
      content: Uint8Array,
      params: unknown
    ) => {
      success: boolean;
      meshes: Array<{
        name: string;
        color?: [number, number, number];
        attributes: {
          position: { array: number[] };
          normal?: { array: number[] };
        };
        index?: { array: number[] };
      }>;
    };
  }>;
}
