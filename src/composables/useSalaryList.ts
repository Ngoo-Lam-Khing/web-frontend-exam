import { useEffect, useState } from 'react';
import type { SalaryItem } from '../types';

export function useSalaryList() {
  const [salaryList, setSalaryList] = useState<SalaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSalaryList() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/v1/salaryLevelList', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('取得薪資列表失敗');
        }

        const result: SalaryItem[] = await response.json();
        setSalaryList(result);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('資料讀取失敗，請稍後再試');
      } finally {
        setLoading(false);
      }
    }

    fetchSalaryList();
    return () => controller.abort();
  }, []);

  return { salaryList, loading, error };
}
