import { useState, useMemo } from 'react';
import { IconButton, Modal, Box, Tooltip, Typography, useMediaQuery, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Checkbox, TableSortLabel, CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { PracticeLog } from '@/types/practiceLog';
import { Activity } from '@/types/activity';

interface ViewPracticeButtonProps {
  activity: Activity | null;
  practiceLogs: PracticeLog[];
  onDelete: (ids: number[]) => void; // Change onDelete to accept a list of IDs
}

export default function ViewPracticeButton({ activity, practiceLogs, onDelete }: ViewPracticeButtonProps) {
  const activityName = activity ? activity.name : '';
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false); // Add deleting state
  const [order, setOrder] = useState<'asc' | 'desc'>('desc'); // Default to descending
  const [orderBy, setOrderBy] = useState<keyof PracticeLog>('date');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirmationOpen = () => setConfirmationOpen(true);
  const handleConfirmationClose = () => setConfirmationOpen(false);

  const handleSelectLog = (id: number) => {
    if (selectedLogs.includes(id)) {
      setSelectedLogs(selectedLogs.filter((logId) => logId !== id));
    } else {
      setSelectedLogs([...selectedLogs, id]);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true); // Set deleting state
    await onDelete(selectedLogs); // Pass the selected logs to the onDelete handler
    setIsDeleting(false); // Reset deleting state after completion
    setSelectedLogs([]);
    handleConfirmationClose();
    handleClose();
  };

  const handleSort = (property: keyof PracticeLog) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedPracticeLogs = useMemo(() => {
    const sortedLogs = [...practiceLogs].sort((a, b) => {
      let compareA: any = a[orderBy];
      let compareB: any = b[orderBy];

      if (orderBy === 'date' || orderBy === 'CreatedAt') {
        compareA = new Date(compareA).getTime();
        compareB = new Date(compareB).getTime();
      }

      if (compareA < compareB) return order === 'asc' ? -1 : 1;
      if (compareA > compareB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedLogs;
  }, [practiceLogs, orderBy, order]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();
  const formatHours = (hours: number) => hours.toFixed(2);

  return (
    <>
      <Tooltip title={`View ${activityName}`}>
        <IconButton
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            top: isMobile ? 'auto' : 140,
            bottom: isMobile ? 96 : 'auto',
            right: 16,
            backgroundColor: 'secondary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
            width: 60,
            height: 60,
            borderRadius: '50%',
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>

      {/* Main Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: '80%',
            maxHeight: '80%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" gutterBottom>
            View Practice Logs for {activityName}
          </Typography>

          <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'date'}
                      direction={orderBy === 'date' ? order : 'desc'}
                      onClick={() => handleSort('date')}
                    >
                      Log Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'count'}
                      direction={orderBy === 'count' ? order : 'asc'}
                      onClick={() => handleSort('count')}
                    >
                      Hours
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'CreatedAt'}
                      direction={orderBy === 'CreatedAt' ? order : 'asc'}
                      onClick={() => handleSort('CreatedAt')}
                    >
                      Created At
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPracticeLogs.map((log) => (
                  <TableRow key={log.ID}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLogs.includes(log.ID)}
                        onChange={() => handleSelectLog(log.ID)}
                      />
                    </TableCell>
                    <TableCell>{formatDate(log.date)}</TableCell>
                    <TableCell>{formatHours(log.count)}</TableCell>
                    <TableCell>{new Date(log.CreatedAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Sticky footer section */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: 0, backgroundColor: 'background.paper', padding: '16px 0 0' }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmationOpen}
              disabled={selectedLogs.length === 0}
            >
              Delete Selected
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirmation Modal */}
      <Modal open={confirmationOpen} onClose={handleConfirmationClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Confirm Deletion
          </Typography>
          <Typography gutterBottom>
            Are you sure you want to delete {selectedLogs.length} entries?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleConfirmationClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <CircularProgress size={24} /> : 'Confirm'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
