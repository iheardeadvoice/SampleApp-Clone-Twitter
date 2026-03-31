import React from 'react';
import { TablePagination, Box } from '@mui/material';

type PaginationControlsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labelRowsPerPage?: string;
};

export const PaginationControls = ({
  count,
  page,
  rowsPerPage,
  rowsPerPageOptions,
  onPageChange,
  onRowsPerPageChange,
  labelRowsPerPage = 'Строк на странице:',
}: PaginationControlsProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage={labelRowsPerPage}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} из ${count}`
        }
        showFirstButton
        showLastButton
      />
    </Box>
  );
};