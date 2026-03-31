import React from 'react';
import { TableCell, TableSortLabel, Box } from '@mui/material';
import type { SortDirection } from '../hooks/useSort';

type SortableTableHeaderProps<T> = {
  field: keyof T;
  label: string;
  currentSort: keyof T | null;
  direction: SortDirection;
  onSort: (field: keyof T) => void;
  width?: string | number;
};

export const SortableTableHeader = <T extends Record<string, any>>({
  field,
  label,
  currentSort,
  direction,
  onSort,
  width,
}: SortableTableHeaderProps<T>) => {
  return (
    <TableCell width={width}>
      <TableSortLabel
        active={currentSort === field}
        direction={currentSort === field ? direction : 'asc'}
        onClick={() => onSort(field)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
};