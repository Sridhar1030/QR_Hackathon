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

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleScan = async (data) => {
    if (data && !isCooldown) { // Check if there is data and not in cooldown
      try {
        const scannedText = data.text;
        const parsedData = JSON.parse(scannedText);

        console.log(parsedData);
        console.log("Scanned Id:", parsedData.userId);

        setQrData(parsedData); // Store scanned data

        const adminEmail = localStorage.getItem("email");
        const cleanedEmail = adminEmail.replace(/"/g, '');
        const id = parsedData.userId;
        const meal = parsedData.meal;

        console.log("adminEmail", adminEmail);

        const response = {
          id,
          adminEmail: cleanedEmail,
          meal,
        };
        console.log("response", response);

        const apiResponse = await axios.post(`${backendUrl}/api/users/scan`, response);

        if (apiResponse.status === 200) {
          toast.success("Scan successful!"); // Show success message
          setIsCooldown(true); // Start cooldown period

          // Set a timeout for 15 seconds to re-enable scanning
          setTimeout(() => {
            setIsCooldown(false);
          }, 5000); // 15 seconds cooldown

          // Navigate to success page
          navigate("/successPage", { state: { userId: parsedData.userId, meal: parsedData.meal } });
        } else {
          console.log("already Scanned", apiResponse);
          toast.warn("This QR code has already been scanned."); // Notify user about already scanned code

          // Activate cooldown even for already scanned QR codes
          setIsCooldown(true);
          setTimeout(() => {
            setIsCooldown(false);
            setQrData(null); // Clear the scanned data to rerender the component
          }, 5000); // 15 seconds cooldown
        }
      } catch (error) {
        console.error("Error parsing scanned data or in API request:", error);
        toast.error("An error occurred while processing the scan."); // Show a toast notification for errors

        // Activate cooldown on error as well
        setIsCooldown(true);
        setTimeout(() => {
          setIsCooldown(false);
          setQrData(null); // Clear the scanned data to rerender the component
        }, 5000); // 15 seconds cooldown
      }
    } else if (isCooldown) {
    }
  };

  const handleError = (err) => {
    console.error("QR code scanning error:", err);
    toast.error("Scanning error occurred. Please try again."); // Show a toast notification for scanning errors

    // Activate cooldown on scanning error as well
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
      setQrData(null); // Clear the scanned data to rerender the component
    }, 5000); // 15 seconds cooldown
  };

  console.log(qrData);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      <h1 className="text-3xl font-bold mb-4">QR Code Scanner</h1>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        facingMode="environment" 
        style={{ width: "300px" }}
      />
      {qrData && <p className="mt-4 text-lg">Scanned Data: {JSON.stringify(qrData)}</p>}
      {isCooldown && <p className="mt-4 text-lg">Waiting for cooldown...</p>}
    </div>
  );
};

export default QrScannerComponent;
