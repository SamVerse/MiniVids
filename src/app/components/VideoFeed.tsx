"use client";
import { useEffect, useRef, useState } from "react";
import { IVideo } from "@/models/video";
import VideoComponent from "./VideoComponent";
import SkeletonReel from "./SkeletonReel";

export default function VideoFeed() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null); 
  const infiniteScrollObserverRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Map<string, HTMLDivElement>>(new Map()); 

  const fetchVideos = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/video${cursor ? `?cursor=${cursor}` : ""}`);
      const data = await res.json();

      if (res.ok && data.videos.length > 0) {
        // this setVideos logic ensures no duplicates
        // and maintains the order of videos
        setVideos((prev) =>
          [...prev, ...data.videos].filter(
            (v, i, arr) => arr.findIndex((x) => x._id === v._id) === i
          )
        );
        setCursor(data.nextCursor);
        if (!data.nextCursor) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching more videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(); // initial load
  }, []);

  // Observer for playing the active video
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When a video becomes visible, set it as active
            setActiveVideoId(entry.target.id);
          }
        });
      },
      {
        // Trigger when 50% of the video is visible
        threshold: 0.5,
      }
    );

    const currentVideoRefs = videoRefs.current;
    currentVideoRefs.forEach((videoEl) => {
      observer.observe(videoEl);
    });

    return () => {
      currentVideoRefs.forEach((videoEl) => {
        observer.unobserve(videoEl);
      });
    };
  }, [videos]); // Rerun when the list of videos changes

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          videos.length > 0
        ) {
          fetchVideos();
        }
      },
      { threshold: 1.0 }
    );

    if (infiniteScrollObserverRef.current)
      observer.observe(infiniteScrollObserverRef.current);

    return () => {
      if (infiniteScrollObserverRef.current)
        observer.unobserve(infiniteScrollObserverRef.current);
    };
  }, [infiniteScrollObserverRef.current, hasMore, loading, videos.length]);

  return (
    <div className="h-screen w-full flex justify-center">
      <div className="h-[70vh] w-full max-w-4xl overflow-y-scroll snap-y snap-mandatory no-scrollbar min-h-[400px]">
        {/* Initial Skeletons */}
        {videos.length === 0 ? (
          <>
            <SkeletonReel />
            <SkeletonReel />
            <SkeletonReel />
          </>
        ) : (
          <>
            {videos.map((video) => (
              <div
                key={video._id?.toString()}
                id={video._id?.toString()} // Assign ID for the observer to track
                ref={(el) => {
                  // Store the ref for each video element
                  if (el && video._id) {
                    videoRefs.current.set(video._id.toString(), el);
                  }
                }}
                className="h-[100%] snap-start flex items-center justify-center"
              >
                <VideoComponent
                  video={video}
                  isActive={activeVideoId === video._id?.toString()} // Pass the isActive prop
                />
              </div>
            ))}

            {hasMore && (
              <div
                ref={infiniteScrollObserverRef}
                className="h-10 w-full flex justify-center items-center text-gray-500"
              >
                {loading && <span>Loading more...</span>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
