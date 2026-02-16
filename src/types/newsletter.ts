/**
 * Newsletter subscription type definitions
 */

export interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

export interface SubscribeRequest {
  email: string;
}

export interface SubscribeResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: Subscriber | { count: number; message: string };
}
