"use client"; // This component must be a client component
import Header from "../components/Header";
import { NotificationProvider } from "../components/Notification";
import VideoFeed from "../components/VideoFeed";

export default function HomeFeed() {
  return (
    <NotificationProvider>
      <div className="relative h-screen w-screen bg-black overflow-hidden pb-60">
        <Header />
        <div className="flex flex-col items-center justify-center h-full ">
          <h2 className="text-3xl font-bold text-white mb-4">Home Feed</h2>
          <VideoFeed />
        </div>
      </div>
    </NotificationProvider>
  );
}