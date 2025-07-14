"use client";
// This component must b?e a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  UploadResponse,
} from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onSuccess: (response: UploadResponse) => void;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  fileTypes?: "image" | "video"; // Optional prop to specify file types
}

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const FileUpload = ({ onSuccess, onProgress, fileTypes, onError }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  //Optional validation for file types
  const validateFile = (file: File) => {
    const allowedTypes = ["image/", "video/"];

    const isAllowedType = allowedTypes.some((type) =>
      file.type.startsWith(type)
    );
    if (!isAllowedType) {
      throw new Error("Invalid file type. Only images and videos are allowed.");
    }

    if (file.size > 100 * 1024 * 1024) {
      throw new Error("File size exceeds the limit of 100MB.");
    }

    return true;
  };

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.error("FileUpload: No file selected.");
      setError("No file selected.");
      return;
    }

    const file = files[0];
    setSelectedFile(file);

    try {
      // Validate the selected file
      validateFile(file);
      setUploading(true);
      setError(null);

      // Retrieve upload authentication credentials
      const authRes = await fetch("/api/auth/imagekit-auth");
      if (!authRes.ok) {
        throw new Error("Failed to retrieve authentication credentials.");
      }
      const authData = await authRes.json();
      const { signature, token, expire } = authData.authenticationParameters;

      // Initiate the file upload
      const uploadResponse = await upload({
        // Authentication parameters
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        expire,
        token,
        signature,
        onProgress: (event) => {
          const progress = Math.round((event.loaded / event.total) * 100);
          if (onProgress) {
            onProgress(progress);
          }
        },
      });

      if (onSuccess) {
        onSuccess(uploadResponse);
      }
    } catch (error: unknown) {
      console.error("FileUpload: An error occurred during upload:", error)
      if (onError && error instanceof Error) {
        onError(error);
      } else if (error instanceof ImageKitInvalidRequestError) {
        setError("Invalid request: " + error.message);
      } else if (error instanceof ImageKitServerError) {
        setError("Server error: " + error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        setError("Network error: " + error.message);
      } else if (error instanceof ImageKitAbortError) {
        setError("Upload aborted: " + error.message);
      } else if (error && typeof error === "object" && "message" in error) {
        setError("An unexpected error occurred: " + (error as { message: string }).message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setUploading(false);
    }
  };
return (
  <>
    <div className="flex items-center gap-4">
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
      >
        {fileTypes === "video" ? "Upload Video" : "Upload Image"}
      </label>

      <input
        id="file-upload"
        type="file"
        accept={fileTypes === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center text-sm text-gray-300 gap-2">
        <span>{selectedFile?.name || "No file chosen"}</span>
        {selectedFile && (
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              const input = document.getElementById("file-upload") as HTMLInputElement;
              if (input) input.value = "";
            }}
            className="text-red-500 hover:text-red-700 font-bold text-base"
            aria-label="Clear selected file"
          >
            ✕
          </button>
        )}
      </div>
    </div>

    {/* Uploading Indicator */}
    {uploading && (
      <div className="mt-2 flex items-center gap-2 text-blue-400">
        <span className="font-medium">Uploading...</span>
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-500"></div>
      </div>
    )}

    {/* Error Message */}
    {error && (
      <div className="mt-2 text-red-500 text-sm">
        <p>{error}</p>
      </div>
    )}
  </>
);

};

export default FileUpload;
