import React, { useEffect, memo, useState } from "react"
import to from "await-to-js"

// Material Components
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

// Services
import { getEvents } from "../../services/events/event-service" 
import { TEvent } from "./event";

interface Column {
  id: 'id' | 'name' | 'location' | 'description';
  label: string;
  minWidth?: number;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID', minWidth: 10 },
  { id: 'name', label: 'Name', minWidth: 80 },
  { id: 'location', label: 'Location', minWidth: 80 },
  { id: 'description', label: 'Description', minWidth: 170 },
];

export const EventPageMemo = memo(function EventPage () {
  // States
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [events, setEvents] = useState([]);

  // Logic
  const getEventService = async () => {
    const [err, response] = await to(getEvents());
    if(err) {
      console.error(err);
      return;
    }
    const { data } = response;
    setEvents(data);
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Component effect
  useEffect(() => { 
    let hasRun = false;
    if (!hasRun) {
      getEventService();
      hasRun = true;
    }
  }, [])

  return(
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    <strong>{column.label}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {events
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event: TEvent) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={event.id}>
                      {columns.map((column) => {
                        const value = event[column.id];
                        return (
                          <TableCell key={column.id}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={events.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
});