import React,{ useState }from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Pagination from '@material-ui/core/Pagination';
import PaginationItem from '@material-ui/core/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { loadData,itemData} from './Mappanel';
import { stop } from './DataLoader';
import { endRunning } from './ControlBar';
import * as d3 from 'd3';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://twitter.com/t_mat">
        t.matsuoka
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export let handleDialogOpen;
export let handleDialogClose;
export let getTripData;
export let setUpPage;
let handleChange;

const jumpData=(p)=>{
  d3.json("/geojson/"+p)
  .then(function(data){
    stop();
    endRunning();
    handleDialogClose();
    setTimeout(loadData(data),500);
  })
  .catch(function(error){
    // エラー処理
  });
}

export default function DataTableDialog(props) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemList, setData] = useState([]);
  const [colnum,setColnum]= useState(4);

  handleDialogOpen = () => {
    const mql1 = window.matchMedia("(orientation: landscape)");
    if(mql1.matches){
      setColnum(4);
    }else{
      setColnum(2);
    }
    setOpen(true);
    handleChange(null,1);
   };

  handleDialogClose = () => {
    setOpen(false);
  };

  handleChange = (e, p) => {
    setPage(p);
    p=p-1;
    let tmp=[];
    let tp=p*8;
    for(let i=0;i<8;i++){
      let ll=tp+i;
      if(ll<itemData.length){
        tmp[i]=itemData[ll]
      }
    }
    setData(tmp);
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleDialogClose} TransitionComponent={Transition}>
        <AppBar>
          <Toolbar>
          <div style={{ flexGrow: 1 }}></div>
          <CloseIcon onClick={handleDialogClose} />
          <Button color="inherit" onClick={handleDialogClose}>
              Close
          </Button>
          </Toolbar>
        </AppBar>
        <div style={{marginTop:70}}>
          <Pagination
              color="primary" 
              count={Math.ceil(itemData.length/8)}
              page={page}
              onChange={handleChange}
              renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
          <Box textAlign="center">
          <ImageList cols={colnum}>
        {itemList.map((item) => (
          <ImageListItem key={item.no}>
            <img
              srcSet={`${process.env.PUBLIC_URL}/images/${item.img}`}
              alt={item.title}
              loading="lazy"
              width={640}
              height={480}
              onClick={fileRead}
            />
            <ImageListItemBar
              title={item.title}
              subtitle={item.date}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.title}`}
 //                 onClick={()=>clip(item.json)}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
          </Box>
        </div>
        <br />
        <Copyright />
      </Dialog>
    </div>
  );
}
