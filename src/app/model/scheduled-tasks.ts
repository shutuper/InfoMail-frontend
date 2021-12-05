export interface ScheduledTask {
  orderId: number;
  jobName: string;
  startAt: Date;
  description: string;
  endAt: Date;
  state: string;
  subject: string;
}

export interface PaginatedScheduledTasks {
  tasks: ScheduledTask[];
  totalNumberOfRows: number;
}
