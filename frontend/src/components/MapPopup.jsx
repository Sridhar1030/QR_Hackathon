import React, { useState, useRef, useEffect } from "react";
import { X, Plus, Minus, Map } from "lucide-react";
import img from "./Blank_board.svg";

const MapPopup = ({ isOpen, onClose }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);
    const popupRef = useRef(null);

        <img
          ref={svgRef}
          src={img}
          alt="Circuit Map"
          className="max-w-full max-h-full object-contain rounded-xl border border-red-600/20 shadow-lg"
          draggable={false}
        />

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
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800 backdrop-blur-sm flex items-center justify-center z-50">
            {/* Simple background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div 
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: "20px 20px",
                    }}
                    className="w-full h-full"
                ></div>
            </div>

            <div
                ref={popupRef}
                className="bg-gradient-to-br from-gray-900 to-black w-[90vw] max-w-[700px] h-[70vh] rounded-3xl shadow-2xl overflow-hidden relative border-2 border-yellow-400 mx-4"
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-xl border-b border-yellow-400/30 p-4 z-20">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-yellow-400/20 rounded-full">
                                <Map className="w-5 h-5 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-mono font-bold text-yellow-400 tracking-wide">
                                CIRCUIT MAP
                            </h3>
                        </div>
                        
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200 rounded-xl hover:bg-yellow-400/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute top-20 left-4 z-20 flex flex-col space-y-2">
                    <button
                        onClick={handleZoomIn}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 
                                 text-black p-3 rounded-xl font-mono font-bold transition-all duration-300 shadow-lg
                                 transform hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 
                                 text-black p-3 rounded-xl font-mono font-bold transition-all duration-300 shadow-lg
                                 transform hover:scale-105 active:scale-95"
                    >
                        <Minus className="w-5 h-5" />
                    </button>
                </div>

                {/* Zoom Level Indicator */}
                <div className="absolute top-20 right-4 z-20">
                    <div className="bg-black/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-yellow-400/30">
                        <div className="text-yellow-400 text-sm font-mono font-bold">
                            ZOOM: {Math.round(scale * 100)}%
                        </div>
                    </div>
                </div>

                {/* Map Container */}
                <div
                    className="w-full h-full pt-20 pb-4 overflow-hidden cursor-move select-none"
                    onMouseDown={handleMouseDown}
                    style={{
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                            transformOrigin: "center center",
                            transition: isDragging ? "none" : "transform 0.3s ease-out",
                        }}
                    >
                        {/* Placeholder for your map image */}
        <img
          ref={svgRef}
          src={img}
          alt="Circuit Map"
          className="max-w-full max-h-full object-contain rounded-xl border border-red-600/20 shadow-lg"
          draggable={false}
        />
                        <div className="max-w-full max-h-full bg-gray-800 rounded-xl border border-yellow-400/20 shadow-lg p-12 flex items-center justify-center">
                            <div className="text-center">
                                <Map className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                                <h3 className="text-lg font-mono font-bold text-yellow-400 mb-2">
                                    Circuit Map
                                </h3>
                                <p className="text-gray-400 font-mono text-sm">
                                    Your map image will display here
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-yellow-400/30 p-3 z-20">
                    <div className="flex justify-center items-center space-x-4 text-sm text-gray-300 font-mono">
                        <span>Drag to pan</span>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <span>Use +/- to zoom</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPopup;