import { Loader } from "lucide-react";
import { useEffect } from "react";

type SpinnerLoadingProps = {
  open: boolean;
};

export default function SpinnerLoading({ open }: SpinnerLoadingProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <div className="flex flex-col gap-2 justify-center items-center bg-black/50 w-full h-full absolute top-0 left-0 z-50">
      <Loader size="40px" className="text-white animate-spin" />
      <span className="text-white">Aguarde...</span>
    </div>
  );
}
