function SkeletonReel() {
  return (
    <div className="h-full snap-start flex items-center justify-center">
      <div className="aspect-[9/16] w-[60vw] max-w-sm bg-neutral-800 rounded-2xl flex items-center justify-center animate-pulse">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default SkeletonReel;
