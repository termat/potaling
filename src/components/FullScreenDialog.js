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
import YotubeDialog from './SimpleDialog'
import {setup} from './Dashboard';

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
export let handleDialogClose;

export default function FullScreenDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(props.open);

  handleDialogOpen = () => {
    isLoadwidgets=false;
    setOpen(true);
  };

  handleDialogClose = () => {
    setOpen(false);
    setup();
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleDialogClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleDialogClose} aria-label="close">
              <DirectionsBikeIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title} onClick={handleDialogClose}>
              ポタリングの記録
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'inline' } }}>
              <div style={{marginRight:"10px",display:'inline'}} ><Follow /></div>
              <div style={{marginRight:"30px",display:'inline'}}><a href="https://twitter.com/share" className="twitter-share-button" style={{marginRight:"20px"}}>Tweet</a></div>
            </Box>
            <CloseIcon onClick={handleDialogClose} />
            <Button color="inherit" onClick={handleDialogClose}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <div>
          <img src={`${process.env.PUBLIC_URL}/images/back.jpg`} style={img_style} alt={'top'} />
          <Box textAlign="center">
          <h1>ポタリングした地域を3D地図で俯瞰する実験サイトです。</h1>
          <p style={{fontSize: "20px"}}>ポタリング（自転車散歩）した地域を俯瞰してみたいと思い作成したWebアプリです。<br />
            データ（geojson/gpx）を読み込むと、3D地図上で経路の俯瞰画像が表示されます。<br />
            実際に走った経路を俯瞰してみると小さな発見があって結構面白いです。</p>
          <Button variant="contained" style={{margin:"10px"}} size="large" onClick={handleDialogClose}>　開　始　</Button>
          <YotubeDialog />
          </Box>
        </div>
        <br />
        <Copyright />
      </Dialog>
    </div>
  );
}

let isLoadwidgets = false;
const Follow = () => {
  React.useEffect(() => {
    if (!isLoadwidgets) {
      const s = document.createElement("script");
      s.setAttribute("src", "https://platform.twitter.com/widgets.js");
      document.body.appendChild(s);
      isLoadwidgets = true;
    }
  }, []);
  return (
    <a href="https://twitter.com/t_mat?ref_src=twsrc%5Etfw" className="twitter-follow-button" data-show-count="false">Follow @t_mat</a>
  );
};
