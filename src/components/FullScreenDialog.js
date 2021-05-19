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
              ポタリングの記録（実験版）
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
          <h1>『Brompton』で『ポタリング』した経路を俯瞰する実験サイトです。</h1>
          <p style={{fontSize: "20px"}}>ポタリングした地域を鳥瞰で眺めてみたいと思い作成した、走行経路を3D地図に表示するWebアプリです。<br />
          作者が自転車で散歩した経路を3D地図で閲覧することができます。<br />
            また、任意の経路情報（Geojson/Point）を読み込んで3D地図に表示することもできます。</p>
          <Button variant="contained" size="large" onClick={handleClose}>開　始</Button>
          </Box>
        </div>
        <br />
        <Copyright />
      </Dialog>
    </div>
  );
}