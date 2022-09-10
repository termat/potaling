import React from 'react';
import clsx from 'clsx';
import { makeStyles,useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MainListItems from './listItems';
import jumpData from './listItems';
import MapPane from './MapPane';
import ControlBar from './ControlBar';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MapIcon from '@material-ui/icons/Map';
import AllOutIcon from '@material-ui/icons/AllOut';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import {fitBounds,parseGeojson,changeStyle} from './MapPane'
import FullScreenDialog from './FullScreenDialog'
import {handleDialogOpen} from './FullScreenDialog'
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import RegistDialog from './RegistDialog'
import {registDialogOpen} from './RegistDialog';

let gpxParser = require('gpxparser');
let tcxParse = require('tcx');
var DOMParser = require('xmldom').DOMParser;
const drawerWidth = 300;

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
  }else if(fname.endsWith(".json")){
    parseGeojson(obj);
  }else if(fname.endsWith(".gpx")){
    let gpx=new gpxParser();
    gpx.parse(obj);
    parseGeojson(JSON.stringify(gpx.toGeoJSON()));
  }else if(fname.endsWith(".tcx")){
    var doc = new DOMParser().parseFromString(obj);
    let tcx=tcxParse(doc);
    parseGeojson(JSON.stringify(tcx));
  }
};

let current_map=0;
//let MAPS=[MapPane.PHT,MapPane.STD,MapPane.SAT];
let MAPS=[MapPane.PHT,MapPane.STD];

const changeMap=()=>{
  current_map=(current_map+1)%MAPS.length;
  changeStyle(MAPS[current_map],current_map);
}

export let setup;

export default function Dashboard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  setup=()=>{
    if(props.window){
      handleDrawerOpen();
      setTimeout(handleDrawerClose,1000);
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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', md: 'block' } }}>
            ポタリングの記録
          </Typography>
          <div className={classes.toolbarButtons}>
          <Grid container alignItems="center" className={classes.root}>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="ログ読込" placement="bottom">
            <IconButton color="inherit" onClick={fileRead}>
              <FolderOpenIcon />
            </IconButton>
            </Tooltip>
            <input type="file" accept=".geojson,.gpx,.tcx" id="file" style={{ display: 'none'}}></input>
            <Tooltip title="地図切替" placement="bottom">
            <IconButton color="inherit" onClick={changeMap}>
              <MapIcon />
            </IconButton>
            </Tooltip>
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
{/*
            <Tooltip title="登録" placement="bottom">  
            <IconButton color="inherit" onClick={registDialogOpen}>
              <NotificationsIcon />
            </IconButton>
            </Tooltip>
*/}
            <Divider orientation="vertical" flexItem />
            </Grid>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List><MainListItems /></List>
        <Divider />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Container maxWidth="xl" className={classes.container} onClick={handleDrawerClose} >
          <MapPane />
          <ControlBar /> 
        </Container>
      </main>
      <FullScreenDialog open={props.window}/>
      <RegistDialog />
    </div>
  );
}
