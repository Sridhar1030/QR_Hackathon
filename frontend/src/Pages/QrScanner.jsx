import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const QrScannerComponent = () => {
  const [qrData, setQrData] = useState(null);
  const [isCooldown, setIsCooldown] = useState(false); // Track cooldown state
  const navigate = useNavigate();

  const handleScan = async (data) => {
    if (data && !isCooldown) { // Check if not in cooldown
      try {
        const scannedText = data.text;
        const parsedData = JSON.parse(scannedText);

        console.log(parsedData);
        console.log("Scanned Id:", parsedData.userId);

        setQrData(parsedData);

        const adminEmail = "canteen@gmail.com";
        const password = "canteen";
        const id = parsedData.userId;
        const meal = parsedData.meal;

        const response = {
          id,
          adminEmail,
          password,
          meal,
        };
        console.log("response", response);

        const apiResponse = await axios.post("http://localhost:3000/api/users/scan", response);

        if (apiResponse.status === 200) {
          toast.success("Scan successful!"); // Show success message
          setIsCooldown(true); // Start cooldown period

          // Set a timeout for 15 seconds to re-enable scanning
          setTimeout(() => {
            setIsCooldown(false);
          }, 15000); // 15 seconds cooldown

          navigate("/successPage", { state: { userId: parsedData.userId , meal:parsedData.meal} });
        } else {
          console.log("already Scanned", apiResponse);
          toast.error(apiResponse.data.message || "API error occurred");
        }
      } catch (error) {
        console.error("Error parsing scanned data or in API request:", error);
        toast.error("An error occurred while processing the scan."); // Show a toast notification for errors
      }
    } else if (isCooldown) {
      toast.warn("Please wait 15 seconds before scanning again."); // Warn if within cooldown period
    }
  };

  const handleError = (err) => {
    console.error("QR code scanning error:", err);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <h1 className="text-3xl font-bold mb-4">QR Code Scanner</h1>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "300px" }}
      />
      {qrData && <p className="mt-4 text-lg">Scanned Data</p>}
    </div>
  );
};

export default QrScannerComponent;
