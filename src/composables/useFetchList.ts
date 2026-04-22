import { useQuery } from '@tanstack/react-query';
import type { EducationItem, SalaryItem } from '../types';

function createFetchListHook<T>(key: string, url: string) {
  return function useFetchList() {
    const {
      data = [],
      isLoading,
      error,
    } = useQuery<T[]>({
      queryKey: [key],
      queryFn: async () => {
        const res = await fetch(url);
        if (!res.ok) throw new Error('資料讀取失敗，請稍後再試');
        return res.json();
      },
      staleTime: 1000 * 60 * 5,
    });
    return { data, isLoading, error: error?.message ?? '' };
  };
}

export const useEducationList = createFetchListHook<EducationItem>(
  'educationList',
  '/api/v1/educationLevelList',
);
export const useSalaryList = createFetchListHook<SalaryItem>(
  'salaryList',
  '/api/v1/salaryLevelList',
);
