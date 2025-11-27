import exifr from "exifr";

import { sourceEntitySourceTypeEnum } from "@/gen";

import type { SourceAudioMetadata, SourceDocMetadata, SourceImageMetadata, SourceVideoMetadata } from '@/gen';

export async function getFileMetadata(file: File): Promise<SourceAudioMetadata | SourceVideoMetadata | SourceImageMetadata | SourceDocMetadata> {
  const base = {
    extension: file.name.split('.').pop() || "",
    contentType: file.type,
    size: file.size,
    lastModified: file.lastModified
  };

  if (file.type.startsWith("image/")) {
    const imageMeta = await new Promise<SourceImageMetadata>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ ...base, width: img.width, height: img.height, type: sourceEntitySourceTypeEnum.IMAGE });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });

    let exifData: Record<string, any> | undefined;
    try {
      exifData = await exifr.parse(file, { gps: true });
    } catch {}

    return { ...imageMeta, exif: exifData };
  }

  if (file.type.startsWith("video/")) {
    const videoMeta = await new Promise<SourceVideoMetadata>((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve({
          ...base,
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
          type: sourceEntitySourceTypeEnum.VIDEO
        });
        URL.revokeObjectURL(video.src);
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });

    return {...videoMeta };
  }

  if (file.type.startsWith("audio/")) {
    const audioMeta = await new Promise<SourceAudioMetadata>((resolve, reject) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        resolve({ ...base, duration: audio.duration, type: sourceEntitySourceTypeEnum.AUDIO });
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = reject;
      audio.src = URL.createObjectURL(file);
    });

    return { ...audioMeta };
  }

  return { ...base, type: sourceEntitySourceTypeEnum.DOC };
}
