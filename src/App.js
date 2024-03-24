import "./styles.css";
import React, { useState, useRef } from "react";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import axios from "./axios";
export default function App() {
  const [data, setData] = useState("Capture : ...");
  const [show, setShow] = useState(false);
  const [toggle, setToggle] = useState(false);
  const inputRef = useRef();
  const barcodeRef = useRef();
  const onCapture = () => {
    setShow(true);
    setToggle(false);
  }
  const byTextInput = () => {
    setShow(false);
    setToggle(true);
    setData("")


  }
  const handleSubmit = async () => {
    if (inputRef.current.value.length == 0) {
      alert("沒有輸入日期")
      return
    }
    const params = {
      barcode: barcodeRef.current.value,
      expireDate: inputRef.current.value,

    };
    console.log(inputRef.current.value)
    console.log(barcodeRef.current.value)
    try {
      await axios.post(
        "https://us-central1-announce-a6f78.cloudfunctions.net/api/api/post",
        {
          params,
        }, {
        headers: {
          "Content-Type": "application/json"

        }
      }

      ).then(function (response) {

        alert(response.status)
      })


    } catch (error) {
      console.log(error); // this is the main part. Use the response property from the error object

      console.log(error.response); // this is the main part. Use the response property from the error object

      return error.response;
    }
  }
  const onUpdateScreen = (err, result) => {
    if (result) {
      setData(result.text);
      setShow(false);
      setToggle(true);
      barcodeRef.current.value = result.text
    } else {
      setData("Not Found");
    }

  };

  return (
    <div className="App">
      <h1>Scan BarCode</h1>
      <>
        {show && (
          <BarcodeScannerComponent
            width={400}
            height={400}
            onUpdate={(err, result) => onUpdateScreen(err, result)}
          />
        )}
        {toggle && (<div className="dialog-box">
          <input type="text" placeholder="到期日(yyyymmdd)" ref={inputRef} /></div>)
        }
        {toggle && (<div className="dialog-box">
          <input type="text" placeholder="barcode" ref={barcodeRef} /></div>)
        }
        <p>{data}</p>
      </>
      <div>
        {show && <button onClick={byTextInput} > 手動輸入 </button>}
        {!show && <button onClick={onCapture} > Capture </button>}
        {toggle && (<button onClick={handleSubmit}   > Submit </button>)
        }
      </div>
    </div>
  );
}
