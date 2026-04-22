import './App.css';
import { useEffect, useMemo, useState, useCallback } from 'react';

import { SnackbarProvider, useSnackbar } from 'notistack';
import useMediaQuery from '@mui/material/useMediaQuery';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { FilterListProvider, useFilterContext } from './context/FilterListContext';

import Banner from './components/Banner';
import Filter from './components/Filter';
import JobCard from './components/JobCard';
import JobCardSkeleton from './components/JobCardSkeleton';
import JobDialog from './components/JobDialog';
import { useJobs } from './composables/useJobs';
import { useJobDetail } from './composables/useJobDetail';

import type { JobFilters } from './types/index';

function AppContent() {
  const {
    educationLabelMap,
    salaryLabelMap,
    educationLoading,
    salaryLoading,
    educationError,
    salaryError,
  } = useFilterContext();
  const isMobile = useMediaQuery('(max-width: 375px)');
  const pageSize = isMobile ? 4 : 6;
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<JobFilters>({
    companyName: '',
    educationLevel: 0,
    salaryLevel: 0,
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const {
    data: JobsData,
    isFetching: jobsFetching,
    error: jobsError,
  } = useJobs(page, pageSize, appliedFilters);

  const total = JobsData?.total ?? 0;
  const {
    jobDetail,
    isFetching: jobDetailFetching,
    error: jobDetailError,
    open,
    handleClickOpen,
    handleClose,
  } = useJobDetail();

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const errors = [jobsError, educationError, salaryError, jobDetailError].filter(Boolean);

    errors.forEach((err) => {
      enqueueSnackbar(String(err), {
        variant: 'error',
      });
    });
  }, [jobsError, educationError, salaryError, jobDetailError, enqueueSnackbar]);

  const handleFilterChange = useCallback((newFilters: JobFilters) => {
    setFilters(newFilters);
  }, []);
  const handleSearch = useCallback(() => {
    setAppliedFilters(filters);
    setPage(1);
  }, [filters]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const handlePageChange = useCallback((_event: unknown, value: number) => {
    setPage(value);
  }, []);

  const jobs = useMemo(
    () =>
      JobsData?.data.map((job) => ({
        ...job,
        educationLabel: educationLabelMap.get(job.educationId) ?? '',
        salaryLabel: salaryLabelMap.get(job.salaryId) ?? '',
      })) ?? [],
    [JobsData, educationLabelMap, salaryLabelMap],
  );

  const jobSkeletons = Array.from({ length: pageSize }, (_, i) => <JobCardSkeleton key={i} />);

  const isFirstLoad = jobsFetching && page === 1;
  return (
    <>
      <Banner />
      <main>
        <h1>適合前端工程師的好工作</h1>
        {(educationLoading || salaryLoading) && (
          <Skeleton
            className="filter"
            variant="rectangular"
            width="100%"
            height={56}
            animation="wave"
          />
        )}
        {!isMobile && !educationLoading && !salaryLoading && (
          <Filter
            filters={filters}
            onChange={handleFilterChange}
            onSearch={handleSearch}
            disabled={jobsFetching}
          />
        )}
        {!jobsFetching && jobs.length === 0 && (
          <Box
            component="section"
            sx={{
              width: '100%',
              height: 458,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #CCCCCC',
              borderRadius: 6,
              color: '#999999',
              font: '16px 400',
            }}
          >
            無資料
          </Box>
        )}
        <section className="job-list">
          {jobsFetching && jobSkeletons}

          {!jobsFetching &&
            jobs.length > 0 &&
            jobs.map((job) => <JobCard key={job.id} job={job} handleClickOpen={handleClickOpen} />)}
        </section>
        <Stack direction="row" sx={{ justifyContent: 'center', mt: '6px' }}>
          {isFirstLoad && (
            <Skeleton
              className="pagination"
              variant="rounded"
              width={isMobile ? 200 : 300}
              height={isMobile ? 32 : 34}
              animation="wave"
            />
          )}
          {!isFirstLoad && jobs.length > 0 && (
            <Pagination
              className="pagination"
              count={totalPages}
              page={page}
              onChange={handlePageChange}
            />
          )}
        </Stack>
        <JobDialog
          detail={jobDetail}
          open={open}
          handleClose={handleClose}
          loading={jobDetailFetching}
        />
      </main>
    </>
  );
}

function App() {
  return (
    <FilterListProvider>
      <SnackbarProvider maxSnack={5}>
        <AppContent />
      </SnackbarProvider>
    </FilterListProvider>
  );
}
export default App;
