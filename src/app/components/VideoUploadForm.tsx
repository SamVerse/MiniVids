"use client";

import FileUpload from "./FileUpload";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // <-- store ImageKit URL
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const getThumbnailFromVideo = (videoUrl: string) => {
    return `${videoUrl}/ik-thumbnail.jpg`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting form with:", {
      title,
      description,
      videoUrl,
      thumbnailUrl,
    });
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    console.log("Form data before API call:", {
      title,
      description,
      videoUrl,
      thumbnailUrl,
    });

    try {
      if (!videoUrl || !thumbnailUrl) {
        setError("Please upload a video file first.");
        return;
      }

      const response = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, videoUrl, thumbnailUrl }),
      });

      console.log("API response status:", response.status);
      const responseData = await response.json();
      console.log("API response data:", responseData);

      if (!response.ok) {
        throw new Error("Failed to save video metadata");
      }

      setSuccess(true);
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
      router.push("/home");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto p-6 space-y-6 bg-black text-white"
      onSubmit={handleSubmit}
    >
      {/* <h2 className="text-2xl font-bold">Upload New Reel</h2> */}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          required
          className="w-full rounded-md bg-neutral-900 text-white border border-neutral-700 p-2 focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full rounded-md bg-neutral-900 text-white border border-neutral-700 p-2 focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>

      {/* Video File Upload */}
      <div>
        <FileUpload
          fileTypes="video"
          onSuccess={(uploadResponse) => {
            const videoUrlString = uploadResponse.url;
            if (videoUrlString) {
              setVideoUrl(videoUrlString);
              setThumbnailUrl(getThumbnailFromVideo(videoUrlString));
            } else {
              setError("Upload failed: Could not retrieve video URL.");
            }
            setIsUploading(false);
          }}
          onProgress={(progress) => {
            setIsUploading(true);
            setUploadProgress(progress);
          }}
          onError={() => {
            setIsUploading(false);
          }}
        />
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="space-y-1">
          <progress
            className="progress progress-primary w-full"
            value={uploadProgress}
            max="100"
          ></progress>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-white text-black font-semibold rounded-md hover:bg-yellow-300  hover:border hover:scale-x-110 disabled:opacity-50"
        disabled={isLoading || isUploading || uploadProgress < 100 || !videoUrl}
      >
        Publish Video
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500">Video published successfully!</p>
      )}
    </form>
  );
}
