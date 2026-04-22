import { useEffect, useState } from 'react';
import type { EducationItem } from '../types';

export function useEducationList() {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEducationList() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/v1/educationLevelList', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('取得教育列表失敗');
        }

        const result: EducationItem[] = await response.json();
        setEducationList(result);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('資料讀取失敗，請稍後再試');
      } finally {
        setLoading(false);
      }
    }

    fetchEducationList();
    return () => controller.abort();
  }, []);

  return { educationList, loading, error };
}
