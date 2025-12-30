import React, { useEffect, useRef, useState } from 'react';
import mpHands from '@mediapipe/hands';
import mpDrawing from '@mediapipe/drawing_utils';
import { GestureType, HandControllerProps } from '../types';

// Manually define connections to avoid import errors from ESM CDN
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17]
];

const HandController: React.FC<HandControllerProps> = ({ onGestureChange, active }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;

    let hands: any = null;
    let animationFrameId: number;
    let stream: MediaStream | null = null;
    let lastVideoTime = 0;
    const videoElement = videoRef.current;

    const onResults = (results: any) => {
      if (!canvasRef.current || !videoRef.current) return;

      const canvasCtx = canvasRef.current.getContext('2d');
      if (!canvasCtx) return;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      // Extract drawing utils safely
      const drawUtils = mpDrawing as any;
      const drawConnectorsFn = drawUtils.drawConnectors || drawUtils.default?.drawConnectors;
      const drawLandmarksFn = drawUtils.drawLandmarks || drawUtils.default?.drawLandmarks;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, width, height);
      
      // Draw semi-transparent video frame for effect
      canvasCtx.globalAlpha = 0.3;
      canvasCtx.drawImage(results.image, 0, 0, width, height);
      canvasCtx.globalAlpha = 1.0;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        // Draw Skeleton
        if (drawConnectorsFn) {
            drawConnectorsFn(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
        }
        if (drawLandmarksFn) {
            drawLandmarksFn(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 2 });
        }

        // Logic to detect Open Hand vs Closed Fist
        const wrist = landmarks[0];
        const tips = [4, 8, 12, 16, 20];
        
        let totalDist = 0;
        tips.forEach((idx: number) => {
          const point = landmarks[idx];
          const dist = Math.sqrt(Math.pow(point.x - wrist.x, 2) + Math.pow(point.y - wrist.y, 2));
          totalDist += dist;
        });
        const avgDist = totalDist / 5;

        // Determine gesture
        if (avgDist < 0.25) {
          onGestureChange(GestureType.CLOSED);
        } else if (avgDist > 0.35) {
          onGestureChange(GestureType.OPEN);
        }
      } else {
        onGestureChange(GestureType.NONE);
      }
      canvasCtx.restore();
    };

    const startCamera = async () => {
        try {
            const handsPkg = mpHands as any;
            const HandsClass = handsPkg.Hands || handsPkg.default?.Hands || handsPkg;

            if (!HandsClass) {
                throw new Error("Failed to load Hands class from MediaPipe package");
            }

            hands = new HandsClass({
                locateFile: (file: string) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                },
            });

            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 0, // 0 = Lite (Faster), 1 = Full (Standard)
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            hands.onResults(onResults);

            if (videoElement) {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, frameRate: { ideal: 30 } }
                });
                videoElement.srcObject = stream;
                await videoElement.play();

                const loop = async () => {
                    if (videoElement.readyState >= 2 && hands) {
                        const now = Date.now();
                        // THROTTLE: Only process hand detection every 100ms (10 FPS)
                        // This frees up the JS thread for the 3D animation to run smoothly at 60 FPS
                        if (now - lastVideoTime >= 100) {
                            lastVideoTime = now;
                            await hands.send({ image: videoElement });
                        }
                    }
                    animationFrameId = requestAnimationFrame(loop);
                };
                loop();
            }
        } catch (e) {
            console.error("Camera/Hands init failed:", e);
            setCameraError("Camera access denied or unavailable.");
        }
    };

    startCamera();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (hands && hands.close) hands.close();
      if (stream) {
          stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [active, onGestureChange]);

  if (!active) return null;

  return (
    <div className="relative w-48 h-36 border-2 border-gold/50 rounded-lg overflow-hidden bg-black/50 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="w-full h-full transform -scale-x-100" width={640} height={480} />
      {cameraError && <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs p-2 text-center">{cameraError}</div>}
      <div className="absolute top-1 left-1 text-[10px] text-white/70 font-mono">SENSOR VIEW</div>
    </div>
  );
};

export default HandController;