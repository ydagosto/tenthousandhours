export interface PracticeLog {
    ID: number;
    CreatedAt: string; // Use string for ISO date-time
    UpdatedAt: string; // Use string for ISO date-time
    DeletedAt: string | null; // Use string for ISO date-time or null
    ActivityID: number;
    count: number;
    date: string; // Use string for ISO date
    UserID: number;
}
