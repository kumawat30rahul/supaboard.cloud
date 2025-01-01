import { useState, useRef, useCallback } from "react";

const VideoRecorderPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<any | null>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      // Request access to user's camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Display live video feed
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      // Handle data as it becomes available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        setRecordedVideo((prev: any) => [...(prev || []), url]);
        chunksRef.current = [];

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear the live video feed
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        videoRef.current.srcObject = null;
      }
    }
  }, [isRecording]);

  const downloadVideo = useCallback(
    (index: number) => {
      if (!recordedVideo) return;

      // Create download link
      const a = document.createElement("a");
      a.href = recordedVideo[index];
      a.download = `recorded-video-${Date.now()}.webm`;
      a.click();
    },
    [recordedVideo]
  );

  return (
    <div className="flex flex-col md:flex-row w-full flex-1 h-auto p-4 gap-6 mt-[100px]">
      <div className="space-y-4 w-full md:w-2/3 lg:w-full relative">
        {/* Live video preview */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full aspect-video"
          />
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2" />
              <span className="text-white text-sm">Recording...</span>
            </div>
          )}
        </div>
        {/* Control buttons */}
        <div className="absolute top-0 left-4 flex justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                transition-colors disabled:opacity-50"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                transition-colors"
            >
              Stop Recording
            </button>
          )}
        </div>
      </div>
      <div className="rounded-md bg-gray-700 p-4 w-full md:w-1/3 lg:w-1/4">
        <span>Recorded Videos</span>
        {recordedVideo && (
          <div className="space-y-4">
            {recordedVideo?.length > 0 ? (
              recordedVideo?.map((url: string, index: number) => (
                <div className="relative">
                  <video
                    key={url}
                    src={url}
                    controls
                    className="w-full aspect-video bg-black rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 h-10 w-10 md:h-6 md:w-6 cursor-pointer border border-yellow-300">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/0/532.png"
                      onClick={() => downloadVideo(index)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white">No recorded videos yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoRecorderPage;
