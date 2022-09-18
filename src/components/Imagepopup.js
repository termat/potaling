import {
    makeStyles,
    Modal,
    Backdrop,
    Fade
  } from "@material-ui/core";
import { CancelPresentationOutlined } from "@material-ui/icons";
  import React, { useState } from "react";
  
  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        backgroundcolor: "red"
      }
    },
    img: {
      outline: "none"
    }
  }));

  export let imagePop;
  export let imageClose;
  
  export default function Imagepopup() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState("false");
  
    imagePop = (url) => {
        console.log(url);
        setImage(url);
        setOpen(true);
    };
    
    imageClose = () => {
        setOpen(false);
    };
  
    return (
      <div>
        <Modal
          className={classes.modal}
          open={open}
          onClose={imageClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            style: {
                backgroundColor: "transparent",
              }
          }}
        >
          <Fade in={open} timeout={500} className={classes.img}>
            <img
              src={image}
              alt="asd"
              style={{ maxHeight: "90%", maxWidth: "90%" }}
            />
          </Fade>
        </Modal>
      </div>
    );
  }