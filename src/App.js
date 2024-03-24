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
  const handleQuery = async () => {
    if (barcodeRef.current.value.length == 0) {
      alert("沒有輸入barcode")
      return
    }
    try {
      await axios.get(
       "https://us-central1-announce-a6f78.cloudfunctions.net/api/api/getOne/"+barcodeRef.current.value,
        // "http://127.0.0.1:3120/api/getOne/"+barcodeRef.current.value,
         {
        
      }

      ).catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser 
          // and an instance of http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }

      }).then(function (response) {
         
        console.log(response.data)
        if(response.status==200){
        inputRef.current.value=response.data.expireDate
}
      })


    } catch (error) {
      console.log(error); // this is the main part. Use the response property from the error object

      console.log(error.response); // this is the main part. Use the response property from the error object

      return error.response;
    }
  }
  const handleSubmit = async () => {
    if (inputRef.current.value.length == 0) {
      alert("沒有輸入日期")
      return
    }
    console.log(inputRef.current.value)
    console.log(barcodeRef.current.value)
 
    try {
      await axios.post(
      "https://us-central1-announce-a6f78.cloudfunctions.net/api/api/post",
        // "http://127.0.0.1:3120/api/post",
        {
          barcode: barcodeRef.current.value,
          expireDate: inputRef.current.value
        }, {
        headers: {
          "Content-Type": "application/json"

        }
      }

      ).catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser 
          // and an instance of http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }

      }).then(function (response) {
       if(response.status==200){
        alert("上傳成功")
       }
       
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
          <input type="text" placeholder="barcode" ref={barcodeRef} /></div>)
        }
        <p></p>
        {toggle && (<div className="dialog-box">
          <input type="text" placeholder="到期日(yyyymmdd)" ref={inputRef} /></div>)
        }
       
        <p>{data}</p>
      </>
      <div>
        {show && <button onClick={byTextInput} > 手動輸入 </button>}
        {!show && <button onClick={onCapture} > 拍照 </button>}
        {toggle && (<button onClick={handleSubmit}   > Submit </button>)}
        {toggle && (<button onClick={handleQuery}   > 查詢 </button>)
        }
      </div>
    </div>
  );
}
