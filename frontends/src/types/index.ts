// ================================
// User & Authentication Types
// ================================

export interface User {
  id: string;
  email: string;
  isVerified: boolean;
  role?: 'admin' | 'user';
  createdAt?: string;
}

export interface AuthResponse {
  requiresActivation: boolean;
  access_token?: string;
  message?: string;
  user?: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ActivatePayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

// ================================
// Paragraph Types
// ================================

export interface Paragraph {
  id: string;
  title: string;
  content?: string; // Optional because the list view only sends the title
  createdAt?: string;
}

// ================================
// Typing Test Types
// ================================

export interface TypingResult {
  id?: string;
  userId?: string;
  paragraphId?: string;
  paragraphTitle?: string; // Used in the history list
  
  timeUsed: number; // in seconds
  wpm: number;      // Gross Speed
  accuracy: number; // Percentage
  netWpm: number;   // Net Speed
  errors: number;   // Number of incorrect words
  
  passed: boolean;
  isInterrupted?: boolean;
  createdAt?: string;
}

export interface SubmitTestPayload {
  typedText: string;
  timeElapsedSeconds: number;
  paragraphId: string;
}

export interface SubmitTestResponse {
  message: string; // "Passed" or "Failed"
  result: TypingResult;
}