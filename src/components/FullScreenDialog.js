import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import Slide from '@material-ui/core/Slide';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        t.matsuoka
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const img_style = {
  width: "100%" 
}; 

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export let handleDialogOpen;

export default function FullScreenDialog() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  handleDialogOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <DirectionsBikeIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title} onClick={handleClose}>
              ポタリングの記録
            </Typography>
            <CloseIcon onClick={handleClose} />
            <Button color="inherit" onClick={handleClose}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <div>
          <img src={`${process.env.PUBLIC_URL}/images/back.jpg`} style={img_style} alt={'top'} />
          <Box textAlign="center">
          <h1>ポタリングした地域を3D地図で俯瞰する実験サイトです。</h1>
          <p style={{fontSize: "20px"}}>ポタリング（自転車散歩）した地域を俯瞰してみたいと思い作成したWebアプリです。<br />
            データ（geojson）を読み込むと、3D地図上で経路をトレースすることもできます。<br />
            実際に走った経路を俯瞰してみると小さな発見があって結構面白いです。</p>
          <Button variant="contained" style={{margin:"10px"}} size="large" onClick={handleClose}>　開　始　</Button>
          <Button variant="contained" style={{margin:"10px"}}  size="large" color="primary">　使い方　</Button>
          </Box>
        </div>
        <br />
        <Copyright />
      </Dialog>
    </div>
  );
}