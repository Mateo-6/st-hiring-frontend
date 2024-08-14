import React, { useEffect, memo, useState } from "react"
import to from "await-to-js"

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { saveNewEvents } from "../../store/reducers/eventSlice";

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
import { IEvent } from "../../models/event";
import { CircularProgress } from "@mui/material";

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
  // Redux
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.events);

  // States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Logic
  const getEventService = async () => {
    const [err, response] = await to(getEvents());
    if(err) {
      console.error(err);
      return;
    }
    const { data } = response;
    dispatch(saveNewEvents(data));
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
                    style={{ minWidth: column.minWidth, backgroundColor: '#606060', color: '#fff'}}
                  >
                    <strong>{column.label}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody style={{ backgroundColor: '#393939' }}>
              {
                events.length > 1 
                ? 
                  events
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((event: IEvent, i: number) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                          {columns.map((column) => {
                            const value = event[column.id];
                            return (
                              <TableCell key={column.id} style={{ color: '#fff' }}>
                                {value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                  })
                : 
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination 
          style={{ backgroundColor: '#606060', color: '#fff' }}
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