export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Analysis {
  id: number;
  image_path: string;
  original_filename: string | null;
  poles_number: number | null;
  processing_time: number | null;
  bounding_boxes: BoundingBox[] | null;
  created_at: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
}

export interface DetectionResult {
  analysis_id: number;
  poles_count: number;
  processing_time: number;
  bounding_boxes: BoundingBox[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}