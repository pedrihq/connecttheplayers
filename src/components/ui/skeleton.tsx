import { Loader } from "lucide-react";

export function SkeletonCard({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center flex-col w-50 h-75 box-border bg-gray-300 animate-pulse">
      <Loader className="animate-spin text-white" />
    </div>
  );
}
