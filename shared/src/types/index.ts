export interface TagDto {
  id: number;
  name: string;
}

export interface SongDto {
  id: number;
  title: string;
  originalKey: string;
  bpm: number | null;
  content: string;
  tags: TagDto[];
  createdAt: string;
  updatedAt: string;
}

export interface SongListItemDto {
  id: number;
  title: string;
  originalKey: string;
  bpm: number | null;
  tags: TagDto[];
}

export interface CreateSongDto {
  title: string;
  originalKey: string;
  bpm?: number;
  content: string;
  tags?: string[];
}

export interface UpdateSongDto extends Partial<CreateSongDto> {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface UserDto {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserDto;
}

export interface AnnouncementDto {
  id: number;
  title: string;
  body: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementDto {
  title: string;
  body: string;
  active?: boolean;
}

export type PrayerType = 'THANKSGIVING' | 'REQUEST';

export interface PrayerDto {
  id: number;
  type: PrayerType;
  body: string;
  name: string | null;
  createdAt: string;
}

export interface CreatePrayerDto {
  type: PrayerType;
  body: string;
  name?: string;
}
