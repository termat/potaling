import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">アプリの使い方</DialogTitle>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/qSJzxQrFlvE" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
     </Dialog>
  );
}

export default function YoutubeDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
      <div>
      <Button variant="contained" size="large" onClick={handleClickOpen}>　使い方　</Button>
      <SimpleDialog open={open} onClose={handleClose} />
      </div>
  );
}