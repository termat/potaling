import React, { useState } from "react";
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
import Box from '@material-ui/core/Box';
import DatePicker from "react-datepicker";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

let fname;
let gpxParser = require('gpxparser');

const ALLOWED_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS'
];

const ALLOWED_ORIGINS = [
    'https://127.0.0.1:3000',
    'https://127.0.0.1:3001'
];


const useStyles = makeStyles((theme) => ({
    dialog: {
        padding: "0px",
      },
    toolbar: {
        height:"60px",
        color: "#fff",
        backgroundColor: "#3f51b5",
      },
    title: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    box: {
        margin:" 0 auto"
      },
    textField:{
        width:"100%",
        fontSize:"16px",
        fontfamily:"sans-serif",
    },
    image:{
        width:"360px",
    },
    button: {
        fontSize:"16px",
        fontfamily:"sans-serif",
        margin: theme.spacing(1),
        width:"100%",
      },
  }));

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
 
  export let registDialogOpen;
  
  export default function RegistDialog() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [photo_src, setPhotoSrc] = useState(null);
    const [route_src, setRouteSrc] = useState(null);
    const [json, setJson] = useState(null);
  
    registDialogOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const fileRead=()=>{
        let fileInput = document.getElementById('file');
        let fileReader = new FileReader();
        fileInput.onchange = () => {
            let file = fileInput.files[0];
            if(!file||!file.name)return;
            fname=file.name.toLowerCase();
            fileReader.readAsText(file);
        };
        fileReader.onload = () => fileProc(fileReader.result);
        fileInput.click();
      };
    
      const fileProc=(obj)=>{
        if(fname.endsWith(".geojson")){
            setJson(obj);
        }else if(fname.endsWith(".json")){
            setJson(obj);
        }else if(fname.endsWith(".gpx")){
          let gpx=new gpxParser();
          gpx.parse(obj);
          obj=JSON.stringify(gpx.toGeoJSON());
          setJson(obj);
        }

        axios.post(`http://localhost:4567/potaling/route`,obj,
           {
               headers: {'Content-Type': 'application/json'},
               accept: "application/json",
               withCredentials: false,
               AccessControlAllowOrigin:"*",
               AccessControlAllowMethods:"GET,PUT,POST,DELETE,OPTIONS",
               preflightContinue: false,
            })
        .then(res => {
          console.log(res);
        })
        .catch(function(error) {
            console.log('ERROR!! occurred in Backend.')
        });
/*
        const fetchOption = {
            method: 'POST',
            body: obj
        };
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', origin);
        headers.append('Access-Control-Allow-Methods', ALLOWED_METHODS.join(','));
        headers.append('Access-Control-Allow-Headers', 'Content-type,Accept,X-Custom-Header');
        headers.append('Content-Type', 'application/json');
        fetchOption['headers'] = headers;   

        fetch(`http://localhost:4567/potaling/route`, fetchOption)
        .then(res => {
            console.log(res.status);
        })
        .catch(error => {
            console.log(error);
        });
*/

    };

    const photoRead=()=>{
        let fileInput = document.getElementById('file');
        let fileReader = new FileReader();
        fileInput.onchange = () => {
            let file = fileInput.files[0];
            if(!file||!file.name)return;
            fname=file.name.toLowerCase();
            fileReader.readAsDataURL(file);
        };
        fileReader.onload = () => setPhotoSrc(fileReader.result);
        fileInput.click();
      };

    return (
      <div>
        <Dialog className={classes.dialog} open={open} onClose={handleClose} TransitionComponent={Transition}>
          <Toolbar className={classes.toolbar}>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <DirectionsBikeIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title} onClick={handleClose}>
                データ登録
              </Typography>
              <CloseIcon onClick={handleClose} />
          </Toolbar>
            <Box className={classes.box}>
                <table align="center" width="100%">
                    <tbody className={classes.textField}>
                    <tr>
                        <td>タイトル</td>
                        <td><TextField className={classes.textField} id="title" label="title" placeholder="タイトル名" variant="standard"　autoComplete="off" /></td>
                    </tr>
                    <tr>
                        <td>データ　</td>
                        <td><Button variant="contained" onClick={fileRead} className={classes.button} startIcon={<FolderOpenIcon />}>読み込み</Button></td>
                   </tr>
                    <tr>
                        <td>記録日　</td>
                        <td><DatePicker className={classes.textField} selected={startDate} onChange={(date) => setStartDate(date)} /></td>
                    </tr>
                    <tr>
                        <td>写　真　</td>
                        <td><Button variant="contained" onClick={photoRead} className={classes.button} startIcon={<FolderOpenIcon />}>読み込み</Button></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img className={classes.image} src={route_src} /></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><img className={classes.image} src={photo_src} /></td>
                    </tr>
                    </tbody>
                </table>
            </Box>
        </Dialog>
      </div>
    );
  };

