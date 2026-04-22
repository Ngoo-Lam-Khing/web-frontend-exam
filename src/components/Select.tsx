import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { useId } from 'react';
import type { EducationItem, SalaryItem } from '../types/index';

interface SelectProps {
  className?: string;
  label: string;
  list: EducationItem[] | SalaryItem[];
  value: number;
  onChange: (e: SelectChangeEvent<number>) => void;
}

export default function SelectDemo({ className, label, list, value, onChange }: SelectProps) {
  const labelId = useId();
  const selectId = useId();

  return (
    <FormControl size="medium" variant="outlined" className={className}>
      <InputLabel
        id={labelId}
        sx={{
          height: 'auto',
          fontSize: 12,
          top: 2,
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={selectId}
        value={value}
        label={label}
        onChange={onChange}
        sx={{
          height: '100%',
          padding: '16px 12px',
          '& .MuiSelect-select': {
            padding: 0,
            fontSize: 16,
          },
          '& .MuiSelect-icon': {
            color: '#808080',
            fontSize: 24,
          },
          '& legend span': {
            fontSize: 11,
            padding: 0,
          },
        }}
      >
        <MenuItem
          value={0}
          sx={{
            fontSize: 16,
          }}
        >
          <em>不限</em>
        </MenuItem>
        {list.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
            sx={{
              fontSize: 16,
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
