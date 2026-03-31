import { useState, useMemo } from 'react';

type UsePaginationProps = {
  initialPage?: number;
  initialRowsPerPage?: number;
  rowsPerPageOptions?: number[];
};

export const usePagination = <T>(
  data: T[],
  {
    initialPage = 0,
    initialRowsPerPage = 5,
    rowsPerPageOptions = [5, 10, 25, 50],
  }: UsePaginationProps = {}
) => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  }, [data, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetPagination = () => {
    setPage(0);
  };

  return {
    paginatedData,
    page,
    rowsPerPage,
    rowsPerPageOptions,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPagination,
    totalCount: data.length,
    totalPages: Math.ceil(data.length / rowsPerPage),
    from: page * rowsPerPage + 1,
    to: Math.min((page + 1) * rowsPerPage, data.length),
  };
};
