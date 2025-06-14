import React from 'react';
import { Pagination, Stack } from '@mui/material';

interface AppPaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const AppPagination: React.FC<AppPaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Stack spacing={2} alignItems="center" my={2}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        variant="outlined"
        shape="rounded"
      />
    </Stack>
  );
};

export default AppPagination;
