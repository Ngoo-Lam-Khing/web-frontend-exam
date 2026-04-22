import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { JobFilters, JobsResponse } from '../types';

export function useJobs(page: number, pageSize: number, filters?: Partial<JobFilters>) {
  return useQuery<JobsResponse>({
    queryKey: [
      'jobs',
      page,
      pageSize,
      filters?.companyName ?? '',
      filters?.educationLevel ?? '',
      filters?.salaryLevel ?? '',
    ],

    queryFn: async () => {
      const search = new URLSearchParams({
        page: String(page),
        pre_page: String(pageSize),
      });

      if (filters?.companyName) {
        search.append('company_name', filters.companyName);
      }

      if (filters?.educationLevel) {
        search.append('education_level', String(filters.educationLevel));
      }

      if (filters?.salaryLevel) {
        search.append('salary_level', String(filters.salaryLevel));
      }

      const res = await fetch(`/api/v1/jobs?${search.toString()}`);

      if (!res.ok) throw new Error('取得工作列表失敗');

      return res.json();
    },

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 5,
  });
}
