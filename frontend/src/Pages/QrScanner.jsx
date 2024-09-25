// src/components/QrScanner.js
import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";

const QrScannerComponent = () => {
  const [qrData, setQrData] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      try {
        const scannedText = data.text; // Storing the scanned data immediately
  
        // Parse data.text if it's a JSON string to access its email field
        const parsedData = JSON.parse(scannedText);
  
        // Log the email from the parsed data
        console.log("Scanned email:", parsedData.email);
  
        // Update the state for display purposes
        setQrData(parsedData);
  
        const email = "canteen@gmail.com";
        const password = "canteen";
        const user_email= parsedData.email;
  
        // Create the response object, including the scanned QR data
        const Response = {
          user_email,
          email,
          password,
        };
        console.log("response",Response)
  
        // Sending the response object to the API
        axios
          .post("http://localhost:3000/api/users/scan", Response)
          .then((response) => {
            console.log("API response:", response.data);
          })
          .catch((error) => {
            console.error("Error in API request:", error);
          });
      } catch (error) {
        console.error("Error parsing scanned data:", error);
      }
    }
  };
  

  const handleError = (err) => {
    console.error("QR code scanning error:", err);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">QR Code Scanner</h1>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "300px" }}
      />
      {qrData && (
        <p className="mt-4 text-lg">Scanned Data</p>
      )}
    </div>
  );
};

export default QrScannerComponent;
