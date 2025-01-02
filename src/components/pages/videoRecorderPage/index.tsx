import { useState, useRef, useCallback } from "react";
import { useDataContext } from "../../../DataContext";

const VideoRecorderPage = () => {
  const { setRecordedVideosContext, recordedVideos } = useDataContext();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string[]>(
    recordedVideos || []
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event?.data?.size > 0) {
          chunksRef.current.push(event?.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef?.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        setRecordedVideo((prev: string[]) => [...(prev || []), url]);
        setRecordedVideosContext((prev) => [...(prev || []), url]);
        chunksRef.current = [];

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert(
        "Error accessing media devices. Please allow access and try again."
      );
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef?.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (videoRef?.current) {
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
      const a = document.createElement("a");
      a.href = recordedVideo[index];
      a.download = `recorded-video-${Date.now()}.webm`;
      a.click();
    },
    [recordedVideo]
  );

  const deleteVideo = useCallback(
    (index: number) => {
      if (!recordedVideo) return;
      const updatedVideos = recordedVideo?.filter((_, i) => i !== index);
      setRecordedVideo(updatedVideos);
      setRecordedVideosContext(updatedVideos);
    },
    [recordedVideo]
  );

  return (
    <div
      className={`relative ${
        isRecording
          ? "h-screen w-screen"
          : "flex flex-col md:flex-row w-full flex-1 h-auto p-4 gap-6 mt-[150px]"
      }`}
    >
      <div
        className={`${
          isRecording
            ? "fixed inset-0 z-50"
            : "space-y-4 w-full md:w-2/3 lg:w-full relative"
        }`}
      >
        {/* Live video preview */}
        <div
          className={`relative bg-black ${
            isRecording ? "w-screen h-screen" : "rounded-lg overflow-hidden"
          }`}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`${
              isRecording ? "w-full h-full object-cover" : "w-full aspect-video"
            }`}
          />
          {isRecording && (
            <>
              <div className="absolute top-4 right-4 flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2" />
                <span className="text-white text-sm">Recording...</span>
              </div>
              <button
                onClick={stopRecording}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 
                transition-colors"
              >
                Stop Recording
              </button>
            </>
          )}
        </div>
        {/* Control buttons - Only show when not recording */}
        {!isRecording && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center space-x-4">
            <img
              src="https://icons.veryicon.com/png/o/miscellaneous/food-time/play-video-1.png"
              alt="playbutton-image"
              className="h-20 w-20 cursor-pointer"
              onClick={startRecording}
            />
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                transition-colors disabled:opacity-50"
            >
              Start Recording
            </button>
          </div>
        )}
      </div>
      {/* Only show recorded videos when not recording */}
      {!isRecording && (
        <div className="rounded-md bg-gray-700 p-4 w-full md:w-1/3 lg:w-1/4">
          <span className="font-bold text-lg">Recorded Videos</span>
          {recordedVideo && (
            <div className="space-y-4">
              {recordedVideo?.length > 0 ? (
                recordedVideo?.map((url: string, index: number) => (
                  <div key={url} className="relative">
                    <video
                      src={url}
                      controls
                      className="w-full aspect-video bg-black rounded-lg"
                    />
                    <div className="flex items-center justify-end gap-2 absolute top-2 right-2 rounded-full h-10 w-10 md:h-6 md:w-6 cursor-pointer">
                      <img
                        src="https://www.svgrepo.com/show/218151/cancel-close.svg"
                        onClick={() => deleteVideo(index)}
                        className="bg-red-500 p-2 md:p-1 rounded-full fill-white"
                      />
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/0/532.png"
                        onClick={() => downloadVideo(index)}
                        className="bg-green-500 p-2 md:p-1 rounded-full"
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
      )}
    </div>
  );
};

export default VideoRecorderPage;
