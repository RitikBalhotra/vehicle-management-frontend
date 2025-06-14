import {
  Box,
  Checkbox,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppButton from '../UI/AppButton';
import AppPagination from '../UI/APPagination';

interface Column {
  name: string;
  label: string;
}

interface RowData {
  id: string | number;
  [key: string]: string | number | boolean | undefined;
}

interface HeaderAction {
  label: string;
  onClick: (selectedRows: RowData[]) => void;
}

interface AppTableProps {
  rowData: RowData[];
  headerColumn: Column[];
  selected?: (rows: RowData[]) => void;
  headerActions?: HeaderAction[];
  title?: string;
}

const AppTable: React.FC<AppTableProps> = ({
  rowData,
  headerColumn,
  selected = () => { },
  headerActions = [],
  title = '',
}) => {
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const itemsPerPage = 10;

  // Filter data based on search input
  const filteredData = useMemo(() => {
    if (!search.trim()) return rowData;
    return rowData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [rowData, search]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Check if all rows are selected
  const isAllSelected = useMemo(
    () => selectedRows.length === paginatedData.length && paginatedData.length > 0,
    [selectedRows, paginatedData]
  );

  // Check if a specific row is selected
  const isRowSelected = useCallback(
    (rowId: string | number) =>
      selectedRows.some((row) => row.id === rowId),
    [selectedRows]
  );

  // Handle checkbox selection
  const handleCheckboxChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      item: string | number | RowData[],
      isSelectAll: boolean
    ) => {
      const { checked } = event.target;

      if (isSelectAll && Array.isArray(item)) {
        setSelectedRows(checked ? [...item] : []);
      } else {
        setSelectedRows((prev) =>
          checked
            ? [...prev, paginatedData.find((row) => row.id === item)!]
            : prev.filter((row) => row.id !== item)
        );
      }
    },
    [paginatedData]
  );

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  // Update parent with selected rows
  useEffect(() => {
    selected(selectedRows);
  }, [selectedRows, selected]);

  return (
    <Box>
      <TableContainer component={Paper}>
        {/* Top Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 2,
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h6">{title}</Typography>

          <TextField
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
            size="small"
            sx={{ minWidth: 200 }}
          />

          {headerActions?.length > 0 &&
            selectedRows?.length === paginatedData?.length &&
            headerActions?.map((e, idx) => (
              <AppButton
                key={idx}
                onClick={() => e.onClick(selectedRows)}
                text={e.label}
              />
            ))}
        </Box>

        {/* Table */}
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <FormControl>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) =>
                      handleCheckboxChange(e, paginatedData, true)
                    }
                  />
                </FormControl>
                Select All
              </TableCell>
              {headerColumn.map((head) => (
                <TableCell key={head.name} sx={{ fontWeight: 'bold' }}>
                  {head.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={row.id || `row-${index}`}>
                <TableCell>
                  <FormControl>
                    <Checkbox
                      checked={isRowSelected(row.id)}
                      onChange={(e) => handleCheckboxChange(e, row.id, false)}
                    />
                  </FormControl>
                </TableCell>

                {headerColumn.map((column) => (
                  <TableCell key={`${row.id || index}-${column.name}`} align="left">
                    {row[column.name]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination and Total Records */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
        <Typography sx={{ marginRight: 5 }}>
          Total Records: {filteredData.length}
        </Typography>
        <AppPagination
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Box>
    </Box>
  );
};

export default AppTable;
