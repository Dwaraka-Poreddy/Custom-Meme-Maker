import React, { useState, useRef, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import "./styles.css";
import EditableText from "./EditableText";
//image related imports
import Canvas from "react-canvas-js";
import domtoimage from "dom-to-image-more";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
//draggable text
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";

import InputBase from "@material-ui/core/InputBase";

const resizestyle = {
  // display: "flex",
  // alignItems: "center",
  // justifyContent: "center",
  // border: "solid 5px ",
  background: "currentColor"
};

const useGridStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

export default function App() {
  const gridclasses = useGridStyles();

  const [images, setImages] = React.useState([]);
  const [plusimage, setPlusimage] = React.useState("false");
  const [activeImage, setActiveImage] = React.useState(
    "https://i.imgflip.com/1iruch.jpg"
  );
  const [isMemeGenerated, setIsMemeGenerated] = React.useState(false);
  const [textelement, settextelement] = useState([
    "Copying others Meme",
    "Creating your own meme"
  ]);
  const [imageElement, setImageElement] = React.useState([]);
  //addText starts here
  const inputRef = useRef(null);
  const [inputVisible, setInputVisible] = useState(false);
  const [text, setText] = useState("");
  const [isMousedOver, setMouseOver] = useState(false);

  function handleAddText() {
    setInputVisible(true);
  }

  function handleSaveText() {
    setInputVisible(false);
    addtextelement(text);
  }

  async function addtextelement(e) {
    settextelement((prevElements) => {
      return [...prevElements, e];
    });
    await setText("");
  }

  function addSecimage(e) {
    setImageElement((prevElements) => {
      return [...prevElements, e];
    });
  }

  // changing image
  function handleImageChange() {
    setIsMemeGenerated(false);
    fetchImage();
  }

  function handleGenerateMeme() {
    setIsMemeGenerated(true);
  }

  //downloading image
  function handleMemeDownlod(el) {
    var canvas = document.getElementById("mnode");
    html2canvas(canvas).then(function (canvas) {
      domtoimage
        .toBlob(document.getElementById("mnode"))
        .then(function (base64image) {
          window.saveAs(base64image, "my-node.png");
        });
    });
  }

  //using local images
  function handleImageInputChange(event) {
    setIsMemeGenerated(false);
    setActiveImage(window.URL.createObjectURL(event.target.files[0]));
  }

  function handleSecImageInputChange(event) {
    setPlusimage(true);
    addSecimage(window.URL.createObjectURL(event.target.files[0]));
  }

  // Fetch images using API
  async function fetchImage() {
    const imgData = await fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .catch((err) => console.error(err));
    const { memes } = await imgData.data;
    await setImages(memes);
    const image = images[Math.floor(Math.random() * images.length)];
    await setActiveImage(image.url);
  }
  //...

  return (
    <div
      // style={{
      //   position: "absolute",
      //   opacity:"0.5",
      //   backgroundImage:
      //     "url(http://www.relatably.com/m/img/all-memes-in-one-picture/internet-meme-poster-small.jpg)"
      // }}
      className="App"
    >
      <div>
        <h1>Meme Generator</h1>
        <h2>Stop COPYING, Start CREATING!</h2>
      </div>
      <Grid style={{ maxWidth: "80vw", margin: "auto" }} container spacing={2}>
        <Grid
          style={{ border: "2px solid", borderRadius: "10px" }}
          item
          xs={12}
          sm={6}
        >
          <Paper className={gridclasses.paper}>xs=12 sm=6</Paper>
          <div
            // style={{
            //   // margin: "0 auto",
            //   maxWidth: "38vw"ss
            // }}
            id="mnode"
          >
            <div
              style={{
                width: "100%",
                maxWidth: "38vw"
                // content: "url(" + activeImage + ")"
              }}
              className="content"
            >
              <img
                style={{
                  // margin: "0 auto",
                  maxWidth: "38vw"
                }}
                src={activeImage}
                alt="0"
              />
            </div>
            <div
              className="content"
              style={{ maxWidth: "38vw" }}
              // style={{
              //   // zIndex: "-1",
              //   maxWidth: "40vw",
              //   marginLeft: "auto",
              //   marginRight: "auto",
              //   marginTop: "0",
              //   marginBottom: "0",
              //   // textAlign: "center",
              //   border: "2px solid currentColor",
              //   backgroundImage: "url(" + activeImage + ")",
              //   backgroundRepeat: "no-repeat",
              //   backgroundSize: "contain",
              //   backgroundPosition: "center"
              //   // backgroundSize: "contain"
              //   // backgroundSize: "100%"
              //   // backgroundPosition: "100% 100%"
              //   // border: "10px solid red"
              // }}
            >
              {textelement.map((item, index) => {
                return (
                  <Draggable style={{ width: 200, zIndex: 9999 }}>
                    <p
                      style={{
                        maxWidth: "38vw"
                      }}
                    >
                      <EditableText text={item} fSize="24" />
                      {/* {item} */}
                    </p>
                  </Draggable>
                );
              })}
              {imageElement.map((item, index) => {
                return (
                  <Draggable style={{ zIndex: 0 }}>
                    <Resizable style={resizestyle} defaultSize={{}}>
                      <img
                        style={{ width: "inherit", height: "inherit" }}
                        src={item}
                        alt={index}
                      />
                    </Resizable>
                  </Draggable>
                );
                // <h2>{item}</h2>;
              })}
              {/* <img style={{ opacity: "0" }} src={activeImage} alt="Meme" /> */}
            </div>
          </div>
        </Grid>

        <Grid
          style={{ border: "2px solid", borderRadius: "10px" }}
          item
          xs={12}
          sm={6}
        >
          <Paper className={gridclasses.paper}>xs=12 sm=6</Paper>

          <React.Fragment>
            <div className="form__btns">
              <Grid style={{ margin: "auto" }} item xs={12} sm={6}>
                <Paper className={gridclasses.paper}>xs=12 sm=6</Paper>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleImageChange}
                >
                  Go to Next Image
                </button>
              </Grid>

              <Grid style={{ margin: "auto" }} item xs={12} sm={6}>
                <Paper className={gridclasses.paper}>xs=12 sm=6</Paper>
                <label className="btn btn-primary" htmlFor="fileInput">
                  Add &nbsp; Local &nbsp; Images
                  <input
                    id="fileInput"
                    name="fileInput"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleImageInputChange}
                    hidden
                  />
                </label>
              </Grid>

              <Grid style={{ margin: "auto" }} item xs={12} sm={6}>
                <Paper className={gridclasses.paper}>xs=12 sm=6</Paper>
                {inputVisible ? (
                  <button
                    className="btn btn-success form__btns form "
                    type="button"
                    onClick={handleSaveText}
                  >
                    Done
                  </button>
                ) : (
                  <button
                    className="btn btn-info form__btns form "
                    type="button"
                    onClick={handleAddText}
                  >
                    Add Meme Text
                  </button>
                )}
              </Grid>

              <Grid style={{ margin: "auto" }} item xs={6} sm={6}>
                <Paper className={gridclasses.paper}>xs=6 sm=4</Paper>

                <div>
                  <div ref={inputRef}>
                    {inputVisible ? (
                      <InputBase
                        multiline
                        variant="outlined"
                        size="medium"
                        style={{
                          fontSize: "16",
                          backgroundColor: "inherit",
                          color: "inherit",
                          border: "0.001px solid ",
                          borderRadius: "5px",
                          width: "80%",
                          height: "45px"
                        }}
                        value={text}
                        onChange={(e) => {
                          setText(e.target.value);
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          border: isMousedOver ? "1.25px dashed " : null
                        }}
                        onMouseOver={() => setMouseOver(true)}
                        onMouseOut={() => setMouseOver(false)}
                        onClick={() => {
                          setInputVisible(true);
                        }}
                      >
                        {/* {text} */}
                      </span>
                    )}
                  </div>
                </div>
              </Grid>

              <Grid style={{ margin: "auto" }} item xs={12} sm={6}>
                <Paper className={gridclasses.paper}>xs=12 sm=6</Paper>
                <label className="btn btn-info" htmlFor="fileInput">
                  Add Secondary Image
                  <input
                    id="fileInput"
                    name="fileInput"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleSecImageInputChange}
                    hidden
                  />
                </label>
              </Grid>

              <Grid style={{ margin: "auto" }} item xs={12} sm={6}>
                <Paper className={gridclasses.paper}>xs=12 sm=6</Paper>
                {isMemeGenerated ? (
                  <button
                    className="btn btn-success form__btns form "
                    type="button"
                    onClick={() => handleMemeDownlod(this)}
                    id="foo"
                  >
                    Download Meme
                  </button>
                ) : (
                  <button
                    className="btn btn-success form__btns form "
                    type="button"
                    onClick={handleGenerateMeme}
                  >
                    Generate Meme
                  </button>
                )}
              </Grid>
            </div>
          </React.Fragment>
        </Grid>
      </Grid>
    </div>
  );
}
