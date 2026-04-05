import apiClient from './api';
import { API_CONFIG } from './api-config';

export interface SubscriptionStatus {
  subscription_status: 'free' | 'pro';
  started_at: string | null;
  expires_at: string | null;
}

export interface SubscriptionActivateResult {
  status: 'activated';
  started_at: string;
  expires_at: string;
}

class SubscriptionService {
  async getStatus(): Promise<SubscriptionStatus> {
    const response = await apiClient.get<SubscriptionStatus>(API_CONFIG.subscriptionStatus);
    return response;
  }

  async activate(): Promise<SubscriptionActivateResult> {
    const response = await apiClient.post<SubscriptionActivateResult>(
      API_CONFIG.subscriptionActivate,
      {}
    );
    return response;
  }

  async isPro(): Promise<boolean> {
    try {
      const status = await this.getStatus();
      return status.subscription_status === 'pro';
    } catch {
      return false;
    }
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;
