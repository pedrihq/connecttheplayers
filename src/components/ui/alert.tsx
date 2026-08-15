import { useAlert } from "@/contexts/AlertMessageContext";
import { X } from "lucide-react";
import { ComponentPropsWithoutRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { tv, VariantProps } from "tailwind-variants";

const DEFAULT_TIME_TO_CLOSE = 5000;

const alert = tv({
  base: "bg-white my-2 w-125",
  variants: {
    type: {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-blue-500 text-white",
    },
  },
  defaultVariants: {
    type: "info",
  },
});

type AlertVariants = VariantProps<typeof alert>;

type AlertProps = ComponentPropsWithoutRef<"div"> &
  AlertVariants & {
    id: string;
    title: string;
    message: string;
    close?: boolean;
    autoClose?: boolean;
    timeToClose?: number;
  };

export type AlertMessage = AlertProps & {
  type: AlertVariants["type"];
};

export default function  Alert({
  title,
  message,
  className,
  id,
  close = true,
  autoClose = false,
  timeToClose = DEFAULT_TIME_TO_CLOSE,
  ...props
}: AlertProps) {
  const { closeAlertMessage } = useAlert();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (autoClose) {
      timeoutId = setTimeout(() => {
        closeAlertMessage(id);
      }, timeToClose);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [autoClose, closeAlertMessage, id, timeToClose]);

  return (
    <div className={twMerge(alert(props), className)} {...props}>
      {autoClose && (
        <div className="h-1 w-full bg-transparent">
          <div
            className="bg-white w-full h-full animate-bar-loader"
            style={
              { animationDuration: `${timeToClose}ms` } as React.CSSProperties
            }
          ></div>
        </div>
      )}
      <div className="flex flex-col p-2">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold uppercase">
            {title ?? "define a title"}
          </span>
          {close && (
            <button
              className="cursor-pointer"
              onClick={() => closeAlertMessage(id)}
            >
              <X />
            </button>
          )}
        </div>
        <p>{message ?? "define a message"}</p>
      </div>
    </div>
  );
}
