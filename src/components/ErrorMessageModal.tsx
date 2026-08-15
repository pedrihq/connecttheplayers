import Modal from "./ui/modal";
import { OctagonX } from "lucide-react";

export type ErrorMessageModalProps = {
  message?: string;
  onClose?: () => void;
};

export default function ErrorMessageModal({
  message,
  onClose,
}: ErrorMessageModalProps) {
  return (
    <Modal backdropClick={onClose} className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <OctagonX className="w-16 h-16 text-red-600" />
        <p className="text-white uppercase font-bold">{message}</p>
      </div>
    </Modal>
  );
}
