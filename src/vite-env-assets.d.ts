declare module 'virtual:assets' {
  export const ALL_ASSETS: {
    fullPath: string;
    basePath: string;
    type: 'image' | 'video' | 'audio';
  }[];
}
