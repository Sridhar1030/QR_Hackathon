import React, { useState, useRef, useEffect } from "react";
import img from "./Blank_board.svg";

const MapPopup = ({ isOpen, onClose }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);
    const popupRef = useRef(null);

    // Zoom in
    const handleZoomIn = () => {
        setScale((prevScale) => Math.min(prevScale * 1.2, 5));
    };

    // Zoom out
    const handleZoomOut = () => {
        setScale((prevScale) => Math.max(prevScale / 1.2, 0.5));
    };

    // Start dragging
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPosition({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    // Handle dragging
    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - startPosition.x,
                y: e.clientY - startPosition.y,
            });
        }
    };

    // Stop dragging
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Close when clicking outside the map
    const handleClickOutside = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen, isDragging]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={popupRef}
                className="bg-white w-[90vw] max-w-[600px] h-[30vh] rounded-lg shadow-xl overflow-hidden relative"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button> 


                {/* Zoom Buttons */}
                <div className="absolute top-2 left-2 z-10 space-x-2">
                    <button
                        onClick={handleZoomIn}
                        className="bg-blue-500 text-white p-2 rounded text-lg"
                    >
                        +
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="bg-blue-500 text-white p-2 rounded text-lg"
                    >
                        -
                    </button>
                </div>

                {/* Map Container */}
                <div
                    className="w-full h-full overflow-auto cursor-move touch-pan-y touch-pan-x"
                    onMouseDown={handleMouseDown}
                >
                    <div
                        style={{
                            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                            transformOrigin: "0 0",
                            transition: isDragging ? "none" : "transform 0.3s",
                        }}
                    >
                        <img
                            ref={svgRef}
                            src={img}
                            alt="full"
                            className="w-full h-auto object-cover object-center"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPopup;
