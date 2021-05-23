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
import MapPane from './MapPane';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MapIcon from '@material-ui/icons/Map';
import AllOutIcon from '@material-ui/icons/AllOut';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import {rewind,startMovie,stopMovie,fitBounds,parseGeojson,changeStyle} from './MapPane'
import FullScreenDialog from './FullScreenDialog'
import {handleDialogOpen} from './FullScreenDialog'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import ControlPanerl from './ControlPanel';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import ResultDialog,{showResultList} from './SearchResultDialog'

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

let sarch_str;

const setSearchValue=(str)=>{
  sarch_str=str;
}

const search=()=>{
  if(!sarch_str)return;
  if(sarch_str.length<1)return;
  let url="https://msearch.gsi.go.jp/address-search/AddressSearch?q="+sarch_str;
  axios.get(url)
  .then(res => {
    showResultList(res.data);
  });
};

const fileRead=()=>{
  let fileInput = document.getElementById('file');
  let fileReader = new FileReader();
  fileInput.onchange = () => {
      let file = fileInput.files[0];
      if(!file||!file.name)return;
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      fileReader.readAsText(file);
  };
  fileReader.onload = () => parseGeojson(fileReader.result);
  fileInput.click();
};

let current_map=0;
let MAPS=[MapPane.SAT,MapPane.PHT,MapPane.STD]

const changeMap=()=>{
  current_map=(current_map+1)%3;
  changeStyle(MAPS[current_map]);
}

export let setup;


export default function Dashboard() {
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
    handleDrawerOpen();
    setTimeout(handleDrawerClose,1000);
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
          <Typography variant="h6" noWrap component="div">
            ポタリングの記録
          </Typography>
          <div className={classes.toolbarButtons}>
          <Grid container alignItems="center" className={classes.root}>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="検索" placement="bottom">
            <IconButton color="inherit" onClick={search} >
              <SearchIcon />
            </IconButton>
            </Tooltip>
            <TextField id="input-search" label="検索" size="small" 
                style={{background:'white'}} 
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    search();
                  }
               }} 
            />
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Geojson読込" placement="bottom">
            <IconButton color="inherit" onClick={fileRead}>
              <FolderOpenIcon />
            </IconButton>
            </Tooltip>
            <input type="file" id="file" style={{ display: 'none'}}></input>
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
            <Divider orientation="vertical" flexItem />
            <Tooltip title="開始" placement="bottom">
            <IconButton color="inherit" onClick={startMovie}>
              <PlayCircleFilledIcon />
            </IconButton>
            </Tooltip>
            <Tooltip title="停止" placement="bottom">
            <IconButton color="inherit" onClick={stopMovie}>
              <PauseCircleFilledIcon />
            </IconButton>
            </Tooltip>
            <Tooltip title="戻る" placement="bottom">
            <IconButton color="inherit" onClick={rewind}>
              <SkipPreviousIcon />
            </IconButton>
            </Tooltip>
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
          <ControlPanerl /> 
        </Container>
      </main>
      <FullScreenDialog />
      <ResultDialog />
    </div>
  );
}
