"use client";

import { ComponentProps, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

type ModalProps = ComponentProps<"div"> & {
  onClose?: () => void;
  backdropClick?: () => void;
};

export default function Modal({
  children,
  className,
  backdropClick,
  ...rest
}: ModalProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event?.key === "Escape") {
        backdropClick?.();
      }
    },
    [backdropClick],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return createPortal(
    <div
      onClick={backdropClick}
      className="absolute w-screen h-screen top-0 left-0 bg-black/30 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={twMerge(
          className,
          "bg-zinc-700 rounded-lg p-2.5 shadow-2xl min-w-75 min-h-25",
        )}
        {...rest}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
