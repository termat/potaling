import React from 'react';
import clsx from 'clsx';
import { makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import MapPane from './MapPane';
import ControlBar from './ControlBar';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AllOutIcon from '@material-ui/icons/AllOut';
import {fitBounds,parseGeojson,} from './MapPane'
import FullScreenDialog from './FullScreenDialog'
import {handleDialogOpen} from './FullScreenDialog'
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import RegistDialog from './RegistDialog'
import Imagepopup from './Imagepopup'
import DataTableDialog from './DataTableDialog';
import {handleTableDialogOpen} from './DataTableDialog';

const drawerWidth = 300;
let fname;

const fileRead=()=>{
  let fileInput = document.getElementById('file');
  let fileReader = new FileReader();
  fileInput.onchange = () => {
      let file = fileInput.files[0];
      if(!file||!file.name)return;
      fname=file.name.toLowerCase();
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      fileReader.readAsText(file);
  };
  fileReader.onload = () => fileProc(fileReader.result);
  fileInput.click();
};

const fileProc=(obj)=>{
  if(fname.endsWith(".geojson")){
      parseGeojson(obj);
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    height:'65px',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  toolbarButtons: {
    marginLeft: 'auto',
  },
}));


export let setup;

export default function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  setup=()=>{
    if(props.window){

    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <Tooltip title="記録一覧" placement="bottom">
          <IconButton
            color="inherit"
            aria-label="open dialog"
            onClick={handleTableDialogOpen}
            edge="start"
          >
          <MenuIcon />
          </IconButton>
          </Tooltip>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', md: 'block' } }}>
            ポタリングの記録
          </Typography>
          <div className={classes.toolbarButtons}>
          <Grid container alignItems="center" className={classes.root}>
          <Divider orientation="vertical" flexItem />
            <Tooltip title="領域移動" placement="bottom">
            <IconButton color="inherit" onClick={fitBounds}>
             <AllOutIcon />
            </IconButton>
            </Tooltip>
            <Tooltip title="トップページ" placement="bottom">
            <IconButton color="inherit" onClick={handleDialogOpen}>
             <NotificationsIcon />
            </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            </Grid>
          </div>
        </Toolbar>
      </AppBar>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Container maxWidth="xl" className={classes.container}>
          <MapPane />
          <ControlBar /> 
        </Container>
      </main>
      <FullScreenDialog open={props.window}/>
      <Imagepopup />
      <DataTableDialog />
    </div>
  );
}
