export const FORMATS = {
  image: ['jpg', 'webp', 'jpeg', 'png', 'gif', 'avif'],
  video: ['mp4', 'webm', 'mov', 'm4v', 'ogg'],
  audio: ['mp3', 'wav', 'ogg', 'm4a', 'webm']
};

export const ASSET_MAP: Record<string, string> = {};

export const resolveAssetUrl = (basePath: string, type: keyof typeof FORMATS): string => {
  const hasExplicitExtension = /\.[a-z0-9]+$/i.test(basePath);
  const base = basePath.replace(/\.[a-z0-9]+$/i, "");

  if (ASSET_MAP[base]) return ASSET_MAP[base];

  return hasExplicitExtension ? basePath : `${base}.${FORMATS[type][0]}`;
};

export const preloadAsset = (
  basePath: string,
  type: keyof typeof FORMATS,
  onComplete: () => void,
  knownUrl?: string
) => {
  const base = basePath.replace(/\.[a-z0-9]+$/i, "");
  const extensions = FORMATS[type];
  
  const tryExtension = (index: number) => {
    // Determine the literal URL to try.
    // If we have a knownUrl (pre-discovered), try it first at index 0.
    // Subsequent indices fetch from the standard FORMATS extension list.
    const url = (index === 0 && knownUrl) ? knownUrl : `${base}.${extensions[knownUrl ? index - 1 : index]}`;
    
    // Check if we have run out of things to try
    const currentExt = knownUrl ? extensions[index - 1] : extensions[index];
    if (index > 0 && !currentExt) {
      onComplete();
      return;
    }
    if (index === 0 && !knownUrl && !extensions[0]) {
      onComplete();
      return;
    }

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
      audio.preload = "auto";
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
        audio.removeEventListener('canplaythrough', onReady);
        audio.removeEventListener('error', onError);
      };
      audio.addEventListener('canplaythrough', onReady);
      audio.addEventListener('error', onError);
      audio.src = url;
    } else if (type === 'video') {
      const video = document.createElement('video');
      video.preload = "auto";
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
        video.removeEventListener('canplaythrough', onReady);
        video.removeEventListener('error', onError);
      };
      video.addEventListener('canplaythrough', onReady);
      video.addEventListener('error', onError);
      video.src = url;
    }
  };

  tryExtension(0);
};
