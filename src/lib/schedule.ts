import apiClient from './api';
import { API_CONFIG } from './api-config';

export interface TrendingTopic {
  title: string;
  description: string;
  source: string;
}

export interface ScheduleCreateRequest {
  platform: string;
  duration_days: number;
  topics: string[];
  auto_post: boolean;
}

export interface CalendarEntry {
  id: string;
  calendar_id: string;
  user_id: string;
  scheduled_date: string;
  scheduled_time: string;
  topic: string;
  platform: string;
  status: 'pending' | 'approved' | 'denied' | 'posted' | 'failed';
  notification_sent: boolean;
  notified_at?: string;
  posted_at?: string;
  content_draft?: string;
  image_url?: string;
}

export interface ScheduleCreateResponse {
  calendar_id: string;
  entries: CalendarEntry[];
}

export interface ScheduleCalendarResponse {
  calendars: {
    id: string;
    platform: string;
    duration_days: number;
    auto_post: boolean;
    status: string;
    created_at: string;
  }[];
  entries: CalendarEntry[];
}

class ScheduleService {
  async getTrendingTopics(platform: string, count: number = 7): Promise<{ topics: TrendingTopic[] }> {
    const response = await apiClient.get<{ topics: TrendingTopic[] }>(
      `${API_CONFIG.topicsTrending}?platform=${platform}&count=${count}`
    );
    return response;
  }

  async createSchedule(data: ScheduleCreateRequest): Promise<ScheduleCreateResponse> {
    const response = await apiClient.post<ScheduleCreateResponse>(API_CONFIG.scheduleCreate, data);
    return response;
  }

  async getCalendar(): Promise<ScheduleCalendarResponse> {
    const response = await apiClient.get<ScheduleCalendarResponse>(API_CONFIG.scheduleCalendar);
    return response;
  }

  async approveEntry(entryId: string): Promise<{ status: string }> {
    const response = await apiClient.get<{ status: string }>(API_CONFIG.scheduleCalendarEntry(entryId) + '/approve');
    return response;
  }

  async denyEntry(entryId: string): Promise<{ status: string }> {
    const response = await apiClient.get<{ status: string }>(API_CONFIG.scheduleCalendarEntry(entryId) + '/deny');
    return response;
  }
}

export const scheduleService = new ScheduleService();
export default scheduleService;