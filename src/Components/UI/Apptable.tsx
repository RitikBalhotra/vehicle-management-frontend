import {
  Box,
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
import { useMemo, useState } from 'react';
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


interface RowAction {
  label: string;
  onClick: (row: RowData) => void;
  color?: 'primary' | 'error' | 'success' | 'info' | 'warning';
}

interface AppTableProps {
  rowData: RowData[];
  headerColumn: Column[];
  title?: string;
  rowActions?: RowAction[] | undefined;
  text?: string;
  onAddClick?: () => void;
  buttonColor?: string;
  buttonIcon?: React.ReactNode; 
}

const AppTable: React.FC<AppTableProps> = ({
  rowData,
  headerColumn,
  rowActions = [],
  title,
  text,
  onAddClick,
  buttonColor,
  buttonIcon

}) => {
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

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
          
            <Box
              sx={{
                backgroundColor: buttonColor,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: buttonColor,
                  opacity: 0.85,
                },
                display: 'inline-block'
              }}
            >
              <AppButton
                onClick={onAddClick ?? (() => {})}
                variant="contained"
                buttonIcon={buttonIcon}
                text={text ?? ""}
              />
            </Box>
        </Box>

        {/* Table */}
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
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
                {headerColumn.map((column) => (
                  <TableCell key={`${row.id || index}-${column.name}`} align="left">
                    {column.name.toLowerCase() === 'actions' ? (
                      <Box display="flex" gap={1}>
                        {rowActions.map((action, idx) => (
                          <AppButton
                            key={idx}
                            text={action.label}
                            color={action.color || 'primary'}
                            onClick={() => action.onClick(row)}
                            variant="contained"
                          />
                        ))}
                      </Box>
                    ) : column.name === 'profilePic' ? (
                      <img
                        src={String(row[column.name])}
                        alt="Profile"
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      row[column.name] ?? "-"
                    )}
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
