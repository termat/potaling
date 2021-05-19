import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {jumpTo} from './MapPane';
import Button from '@material-ui/core/Button';

let data=[];
let handleResDialogOpen;
let count=0;

export const showResultList=(list)=>{
    data=list;
    handleResDialogOpen();
};

export default function ResultDialog(props) {
  const [open, setOpen] = React.useState(false);

  handleResDialogOpen = () => {
    setOpen(true);
  };

  const handleResDialogClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (value) => {
    const coord=value.geometry.coordinates;
    jumpTo(coord);
  };

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">
      <Button variant="contained" color="primary" onClick={handleResDialogClose}>閉じる</Button>
    　</DialogTitle>
      <List>
        {data.map((obj) => (
          <ListItem button onClick={() => handleListItemClick(obj)} key={obj.properties.title+String(count++)}>
            <ListItemText primary={obj.properties.title} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
