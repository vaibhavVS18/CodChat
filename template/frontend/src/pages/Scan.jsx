import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const Scan = () => {
    const webcamRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [rollNumber, setRollNumber] = useState("");
    const [found, setFound] = useState(false);
    const isProcessingRef = useRef(false);

    // Only detect exactly 5 digits
    const rollRegex = /\b\d{5}\b/;

    const captureAndScan = async () => {
        if (!webcamRef.current || isProcessingRef.current || found) return;
        isProcessingRef.current = true;

        const imageSrc = webcamRef.current.getScreenshot({
            width: 320,
            height: 240,
        });

        try {
            const result = await Tesseract.recognize(imageSrc, "eng");
            const text = result.data.text || "";

            const rollMatch = text.match(rollRegex);

            if (rollMatch) {
                const roll = rollMatch[0];
                setRollNumber(roll);
                setFound(true);
                setIsCameraOn(false);
            }
        } catch (err) {
            console.error("OCR Error:", err);
        } finally {
            isProcessingRef.current = false;
        }
    };

    useEffect(() => {
        let interval;
        if (isCameraOn && !found) {
            interval = setInterval(captureAndScan, 1500);
        }
        return () => clearInterval(interval);
    }, [isCameraOn, found]);

    return (
        <div className="bg-gray-700 min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-2xl font-bold mb-6">ID Card Scanner</h1>

            {!isCameraOn && !found && (
                <button
                    onClick={() => setIsCameraOn(true)}
                    className="bg-green-600 px-6 py-2 rounded-lg"
                >
                    Start Webcam
                </button>
            )}

            {isCameraOn && !found && (
                <>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        className="rounded-lg border-4 border-white mb-4"
                        width={320}
                        height={240}
                    />
                    <button
                        onClick={() => setIsCameraOn(false)}
                        className="bg-red-600 px-6 py-2 rounded-lg"
                    >
                        Stop Webcam
                    </button>
                </>
            )}

            {/* ✔ Only show result */}
            {found && (
                <div className="mt-6 p-4 bg-green-700 rounded-lg text-center">
                    🎉 Roll Number Detected:{" "}
                    <span className="font-bold text-yellow-300">{rollNumber}</span>
                </div>
            )}
        </div>
    );
};

export default Scan;
