import './App.css';
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { useEffect, useRef, useState } from 'react';


function App() {

  var video, liveView , h1 , model = undefined , children = [] , remove_1 = [] , remove_2 , after_remove_1, after_remove_2;
  const videoRef = useRef(null);
  const remove_ref = useRef(null);

  useEffect(() => {
    video = document.getElementById("webcam");
    liveView = document.getElementById("liveView");
    h1 = document.getElementById("h1_remove");
    remove_1 = document.getElementsByClassName("info");
    remove_2 = document.getElementsByClassName("highlighter");
    after_remove_1 = document.getElementsByClassName("after_remove_div");
    after_remove_2 = document.getElementsByClassName("after_remove_p");
    model_difiner();
  }, [])


  async function model_difiner() {

    videoRef.current.srcObject = null;

    var stream = await navigator.mediaDevices.getUserMedia({ video: true, })
    videoRef.current.srcObject = stream;

    cocoSsd.load().then(function(loadedModel) {
      model = loadedModel;
      predictWebcam();
    });
  }

  function predictWebcam() {
      if (videoRef.current.srcObject != null) {
        model.detect(video).then(function (predictions) {
      
        for(var i = 0 ; i <= remove_1.length ; i++)
        {
          if(remove_1[i] != null)
          {
            remove_1[i].className = "after_remove_div";
            remove_2[i].className = "after_remove_p";
          } 
        }

        for (let i = 0; i < children.length; i++) {
          liveView.removeChild(children[i]);
        }

        children.splice(0);

        for (let n = 0; n < predictions.length; n++) {
          if (predictions[n].score > 0.66) {
            console.log(predictions[n])
            const p = document.createElement("p");
            p.setAttribute("class", "info");
            p.id = "remove_p";
            p.ref = remove_ref;
            p.innerText =
              predictions[n].class +
              " " +
              Math.round(parseFloat(predictions[n].score) * 100) +
              "% confidence.";
            p.style =
              "margin-left: " +
              predictions[n].bbox[0] +
              "px; margin-top: " +
              (predictions[n].bbox[1] - 10) +
              "px; width: " +
              (predictions[n].bbox[2] - 10) +
              "px; top: 0; left: 0;";

            const highlighter = document.createElement("div");
            highlighter.setAttribute("class", "highlighter");
            highlighter.ref = remove_ref;
            highlighter.style =
              "left: " +
              predictions[n].bbox[0] +
              "px; top: " +
              predictions[n].bbox[1] +
              "px; width: " +
              predictions[n].bbox[2] +
              "px; height: " +
              predictions[n].bbox[3] +
              "px;";
            highlighter.id = "remove_div"

            liveView.appendChild(highlighter);
            liveView.appendChild(p);
            children.push(highlighter);
            children.push(p);
          }
        }
        window.requestAnimationFrame(predictWebcam);
      });
    }
    // else {
    //   console.log("hello ");
    //   setTimeout(() => {
    //     predictWebcam();
    //   }, 1000);
    // }
  }


  return (
    <div className="App">
      <section className="">
        <div id="liveView" className="camView" style={{ position: 'relative' }}>
          <video id="webcam" autoPlay={true} ref={videoRef} width="640" height="480"></video>
        </div>
      </section>
    </div>
  );
}

export default App;