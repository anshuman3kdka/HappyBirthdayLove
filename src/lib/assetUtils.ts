export const FORMATS = {
  image: ['jpg', 'webp', 'jpeg', 'png', 'gif', 'avif'],
  video: ['mp4', 'webm', 'mov', 'm4v', 'ogg'],
  audio: ['mp3', 'wav', 'ogg', 'm4a', 'webm']
};

export const ASSET_MAP: Record<string, string> = {};

export const resolveAssetUrl = (basePath: string, type: keyof typeof FORMATS): string => {
  const base = basePath.replace(/\.[a-z0-9]+$/i, "");
  return ASSET_MAP[base] || `${base}.${FORMATS[type][0]}`;
};

export const preloadAsset = (
  basePath: string,
  type: keyof typeof FORMATS,
  onComplete: () => void
) => {
  const base = basePath.replace(/\.[a-z0-9]+$/i, "");
  const extensions = FORMATS[type];
  
  const tryExtension = (index: number) => {
    const ext = extensions[index];
    if (!ext) {
      onComplete(); // all failed, fallback to default behavior
      return;
    }

    const url = `${base}.${ext}`;

    if (type === 'image') {
      const img = new Image();
      img.onload = () => {
        ASSET_MAP[base] = url;
        onComplete();
      };
      img.onerror = () => tryExtension(index + 1);
      img.src = url;
    } else if (type === 'audio') {
      const audio = new Audio();
      audio.preload = "metadata";
      const onReady = () => {
        ASSET_MAP[base] = url;
        cleanup();
        onComplete();
      };
      const onError = () => {
        cleanup();
        tryExtension(index + 1);
      };
      const cleanup = () => {
        audio.removeEventListener('loadedmetadata', onReady);
        audio.removeEventListener('error', onError);
      };
      audio.addEventListener('loadedmetadata', onReady);
      audio.addEventListener('error', onError);
      audio.src = url;
    } else if (type === 'video') {
      const video = document.createElement('video');
      video.preload = "metadata";
      const onReady = () => {
        ASSET_MAP[base] = url;
        cleanup();
        onComplete();
      };
      const onError = () => {
        cleanup();
        tryExtension(index + 1);
      };
      const cleanup = () => {
        video.removeEventListener('loadedmetadata', onReady);
        video.removeEventListener('error', onError);
      };
      video.addEventListener('loadedmetadata', onReady);
      video.addEventListener('error', onError);
      video.src = url;
    }
  };

  tryExtension(0);
};
