import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';
import PageHeading from '../../candidate/components/PageHeading';

const statusColors = {
  Activo: 'success',
  Pendiente: 'warning',
  Inactivo: 'default',
  Suspendido: 'error'
};

function loadRecords(storageKey, initialRecords) {
  try {
    const storedRecords = localStorage.getItem(storageKey);
    return storedRecords ? JSON.parse(storedRecords) : initialRecords;
  } catch {
    return initialRecords;
  }
}

export default function AdminEntityPage({ title, description, entityName, storageKey, fields, columns, initialRecords }) {
  const emptyRecord = useMemo(() => Object.fromEntries(fields.map((field) => [field.name, field.defaultValue || ''])), [fields]);
  const [records, setRecords] = useState(() => loadRecords(storageKey, initialRecords));
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyRecord);
  const [message, setMessage] = useState('');

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
  );

  const persistRecords = (nextRecords) => {
    setRecords(nextRecords);
    localStorage.setItem(storageKey, JSON.stringify(nextRecords));
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(emptyRecord);
    setDialogOpen(true);
  };

  const openEditDialog = (record) => {
    setEditingId(record.id);
    setForm(Object.fromEntries(fields.map((field) => [field.name, record[field.name] || ''])));
    setDialogOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingId) {
      persistRecords(records.map((record) => (record.id === editingId ? { ...record, ...form } : record)));
      setMessage(`${entityName} actualizado correctamente.`);
    } else {
      persistRecords([...records, { id: Date.now(), ...form }]);
      setMessage(`${entityName} creado correctamente.`);
    }

    setDialogOpen(false);
  };

  const handleDelete = () => {
    persistRecords(records.filter((record) => record.id !== deleteRecord.id));
    setDeleteRecord(null);
    setMessage(`${entityName} eliminado correctamente.`);
  };

  return (
    <>
      <PageHeading
        title={title}
        description={description}
        action={
          <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={openCreateDialog}>
            Crear {entityName.toLowerCase()}
          </Button>
        }
      />

      <MainCard border sx={{ borderRadius: 3 }} contentSX={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ p: 2.5, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Box>
            <Typography variant="h3">{title} registrados</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {filteredRecords.length} de {records.length} registros
            </Typography>
          </Box>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="small"
            placeholder={`Buscar ${entityName.toLowerCase()}...`}
            sx={{ width: { xs: '100%', sm: 300 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={18} />
                  </InputAdornment>
                )
              }
            }}
          />
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.name}>{column.label}</TableCell>
                ))}
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow hover key={record.id}>
                  {columns.map((column) => (
                    <TableCell key={column.name}>
                      {column.name === 'status' ? (
                        <Chip size="small" label={record[column.name]} color={statusColors[record[column.name]] || 'default'} />
                      ) : (
                        record[column.name]
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Tooltip title="Actualizar">
                      <IconButton color="primary" onClick={() => openEditDialog(record)}>
                        <IconEdit size={19} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton color="error" onClick={() => setDeleteRecord(record)}>
                        <IconTrash size={19} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!filteredRecords.length && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No se encontraron registros.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? `Actualizar ${entityName.toLowerCase()}` : `Crear ${entityName.toLowerCase()}`}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {fields.map((field) => (
                <TextField
                  key={field.name}
                  label={field.label}
                  type={field.type || 'text'}
                  select={Boolean(field.options)}
                  required={field.required !== false}
                  value={form[field.name]}
                  onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                  slotProps={{
                    inputLabel: { shrink: true },
                    ...(field.type === 'password' ? { htmlInput: { minLength: 6 } } : {})
                  }}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              ))}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Guardar cambios' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(deleteRecord)} onClose={() => setDeleteRecord(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar {entityName.toLowerCase()}</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Esta acción eliminará a <strong>{deleteRecord?.name}</strong>. No se puede deshacer.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteRecord(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(message)} autoHideDuration={3000} onClose={() => setMessage('')} message={message} />
    </>
  );
}

AdminEntityPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  entityName: PropTypes.string.isRequired,
  storageKey: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialRecords: PropTypes.arrayOf(PropTypes.object).isRequired
};
