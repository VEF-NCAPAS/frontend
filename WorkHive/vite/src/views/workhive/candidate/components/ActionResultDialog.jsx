import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import { buttonSX } from '../data/candidateData';

import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';

const variants = {
  success: { background: '#dcf6e8', color: '#25835a', icon: IconCheck },
  info: { background: '#dff3ff', color: '#2475a6', icon: IconInfoCircle },
  cancel: { background: '#ffe3e3', color: '#a33c3c', icon: IconX }
};

export default function ActionResultDialog({ open, onClose, title, description, type = 'success' }) {
  const variant = variants[type] || variants.success;
  const Icon = variant.icon;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
        <Avatar sx={{ bgcolor: variant.background, color: variant.color, height: 58, mx: 'auto', mb: 2, width: 58 }}>
          <Icon size={30} />
        </Avatar>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button variant="contained" color="secondary" sx={buttonSX} onClick={onClose}>
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
}
