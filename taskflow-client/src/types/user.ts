export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  usageType: number; // 0 = Personal, 1 = Business
}

export interface UserProfile {
  id: string;
  userId: string;
  avatarUrl: string | null;
  googleCalendarToken: string | null;
  outlookCalendarToken: string | null;
  isGoogleConnected: boolean;
  isOutlookConnected: boolean;
}
