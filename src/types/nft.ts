export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export interface INFTMetadata {
  name: string;
  description: string;
  price: string;
  category: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string; // Optional thumbnail for video/audio
  properties?: {
    fileSize?: string;
    duration?: string; // For video/audio
    format?: string;
    [key: string]: string | undefined;
  };
}

export interface INFTData extends INFTMetadata {
  tokenId: string;
  owner: string;
  seller: string;
  sold: boolean;
}

// Validation constants
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/gif'];
export const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm'];
export const SUPPORTED_AUDIO_FORMATS = ['audio/wav', 'audio/mpeg'];

export const MAX_FILE_SIZE = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  AUDIO: 50 * 1024 * 1024 // 50MB
}; 