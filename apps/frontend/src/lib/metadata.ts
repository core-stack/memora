import exifr from 'exifr';

type BaseMetadata = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

type ImageMetadata = {
  width: number;
  height: number;
  exif?: Record<string, any>;
};

type VideoMetadata = {
  width: number;
  height: number;
  duration: number;
};

type AudioMetadata = {
  duration: number;
};

export async function getFileMetadata(file: File): Promise<BaseMetadata & Partial<ImageMetadata & VideoMetadata & AudioMetadata>> {
  const base: BaseMetadata = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };

  if (file.type.startsWith("image/")) {
    const imageMeta = await new Promise<ImageMetadata>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });

    let exifData: Record<string, any> | undefined;
    try {
      exifData = await exifr.parse(file, { gps: true });
    } catch (e) {
    }

    return { ...base, ...imageMeta, exif: exifData };
  }

  if (file.type.startsWith("video/")) {
    const videoMeta = await new Promise<VideoMetadata>((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
        });
        URL.revokeObjectURL(video.src);
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });

    return { ...base, ...videoMeta };
  }

  if (file.type.startsWith("audio/")) {
    const audioMeta = await new Promise<AudioMetadata>((resolve, reject) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        resolve({ duration: audio.duration });
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = reject;
      audio.src = URL.createObjectURL(file);
    });

    return { ...base, ...audioMeta };
  }

  return base;
}
