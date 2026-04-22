import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { JobDetail } from '../types';

export function useJobDetail() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const query = useQuery({
    queryKey: ['jobDetail', jobId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/jobs/${jobId}`);
      if (!res.ok) throw new Error('取得工作詳情失敗');
      return res.json() as Promise<JobDetail>;
    },

    enabled: !!jobId,

    staleTime: 1000 * 60 * 5,
  });

  function handleClickOpen(id: string) {
    setJobId(id);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return {
    jobDetail: query.data ?? null,
    isFetching: query.isFetching,
    error: query.error,
    open,
    handleClickOpen,
    handleClose,
  };
}
