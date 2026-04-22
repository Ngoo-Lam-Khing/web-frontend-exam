import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useEducationList, useSalaryList } from '../composables/useFetchList';
import type { EducationItem, SalaryItem } from '../types';

interface FilterListContextValue {
  educationList: EducationItem[];
  salaryList: SalaryItem[];
  educationLoading: boolean;
  salaryLoading: boolean;
  educationError: string;
  salaryError: string;
  educationLabelMap: Map<number, string>;
  salaryLabelMap: Map<number, string>;
}

const FilterListContext = createContext<FilterListContextValue | null>(null);

export function FilterListProvider({ children }: { children: ReactNode }) {
  const {
    data: educationList = [],
    isLoading: educationLoading,
    error: educationError,
  } = useEducationList();
  const { data: salaryList = [], isLoading: salaryLoading, error: salaryError } = useSalaryList();

  const educationLabelMap = useMemo(
    () => new Map(educationList.map((item) => [item.id, item.label])),
    [educationList],
  );

  const salaryLabelMap = useMemo(
    () => new Map(salaryList.map((item) => [item.id, item.label])),
    [salaryList],
  );

  const value = useMemo(
    () => ({
      educationList,
      educationLoading,
      educationError,
      educationLabelMap,

      salaryList,
      salaryLoading,
      salaryError,
      salaryLabelMap,
    }),
    [
      educationList,
      educationLoading,
      educationError,
      educationLabelMap,

      salaryList,
      salaryLoading,
      salaryError,
      salaryLabelMap,
    ],
  );

  return <FilterListContext.Provider value={value}>{children}</FilterListContext.Provider>;
}

export function useFilterContext() {
  const ctx = useContext(FilterListContext);
  if (!ctx) throw new Error('useFilterList must be used within FilterListProvider');
  return ctx;
}
