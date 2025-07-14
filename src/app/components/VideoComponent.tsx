import { IKVideo } from "imagekitio-next";
import { IVideo } from "@/models/video";
import { useEffect, useRef } from "react";

interface Props {
  video: IVideo;
  isActive: boolean;
}

export default function VideoComponent({ video, isActive }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videoEl = containerRef.current?.querySelector("video");

    if (videoEl) {
      if (isActive) {
        videoEl.play().catch(() => {}); // in case autoplay is blocked
      } else {
        videoEl.pause();
      }
    }
  }, [isActive]);

  // --- START DEBUGGING LOG ---
  console.log(`Rendering video: ${video.title}, URL: ${video.videoUrl}`);
  const filePath = video.videoUrl ? video.videoUrl.substring(video.videoUrl.lastIndexOf("/") + 1) : "";
  console.log(`Generated filePath: ${filePath}`);
  // --- END DEBUGGING LOG ---

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-black">
      <div className="flex justify-center items-center w-full h-full">
        <div
          ref={containerRef}
          className="w-[90vw] max-w-[360px]"
          style={{
            aspectRatio: "9 / 16",
            height: "100%",
            maxHeight: "100%",
          }}
        >
          <IKVideo
            path={filePath}
            urlEndpoint="https://ik.imagekit.io/freak"
            transformation={[{ height: "1920", width: "1080" }]}
            controls={video.controls}
            loop
            playsInline
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      </div>

      <div className="absolute bottom-[20%] left-4 right-4 text-white px-4">
        <h2 className="text-lg font-semibold">{video.title}</h2>
        <p className="text-sm opacity-80 line-clamp-2">{video.description}</p>
      </div>
    </div>
  );
}
