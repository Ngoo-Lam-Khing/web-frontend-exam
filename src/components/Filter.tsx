import { useCallback, memo, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFilterContext } from '../context/FilterListContext';
import Select from './Select';
import type { JobFilters } from '../types/index';
import './Filter.css';

interface FilterProps {
  filters: JobFilters;
  onChange: (filter: JobFilters) => void;
  onSearch: () => void;
  disabled?: boolean;
}

const Filter = memo(({ filters, onChange, onSearch, disabled = false }: FilterProps) => {
  const { educationList, salaryList } = useFilterContext();

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (disabled) return;
      e.preventDefault();
      onSearch();
    },
    [disabled, onSearch],
  );
  return (
    <Box component="form" className="filter" noValidate autoComplete="off" onSubmit={onSubmit}>
      <TextField
        value={filters.companyName}
        className="filter__company"
        label="公司名稱"
        placeholder="請輸入公司名稱"
        sx={{
          '& input': {
            padding: '12px 16px',
            fontSize: 16,
          },
          '& ::placeholder': {
            fontSize: 16,
          },
          '& label': {
            fontSize: 16,
          },
          '& label.Mui-focused': {
            height: 'auto',
            top: 2,
            fontSize: 12,
          },
          '& legend span': {
            fontSize: 11,
            padding: 0,
          },
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange({
            ...filters,
            companyName: e.target.value,
          })
        }
      />
      <Select
        className="filter__select"
        label="教育程度"
        list={educationList}
        value={filters.educationLevel}
        onChange={(e) =>
          onChange({
            ...filters,
            educationLevel: Number(e.target.value),
          })
        }
      />
      <Select
        className="filter__select"
        label="薪資範圍"
        list={salaryList}
        value={filters.salaryLevel}
        onChange={(e) =>
          onChange({
            ...filters,
            salaryLevel: Number(e.target.value),
          })
        }
      />
      <Button className="filter__submit" type="submit" disabled={disabled}>
        條件搜尋
      </Button>
    </Box>
  );
});

export default Filter;
