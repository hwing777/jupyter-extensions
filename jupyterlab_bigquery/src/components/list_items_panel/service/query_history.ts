import { requestAPI } from './api_request';

export interface QueryHistory {
  jobs: {};
  jobIds: [];
}

export interface Job {
  job: {};
}

export class QueryHistoryService {
  async getQueryHistory(projectId: string): Promise<QueryHistory> {
    const body = { projectId: projectId };
    const requestInit: RequestInit = {
      body: JSON.stringify(body),
      method: 'POST',
    };
    const data = await requestAPI<QueryHistory>('v1/queryHistory', requestInit);
    return {
      jobs: data.jobs,
      jobIds: data.jobIds,
    };
  }
}

export class QueryDetailsService {
  async getQueryDetails(jobId: string): Promise<Job> {
    const body = { jobId: jobId };
    const requestInit: RequestInit = {
      body: JSON.stringify(body),
      method: 'POST',
    };
    const data = await requestAPI<Job>('v1/queryDetails', requestInit);
    return {
      job: data,
    };
  }
}
