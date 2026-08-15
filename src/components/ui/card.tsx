import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = ComponentProps<"div">;
type CardHeaderProps = {
  children: React.ReactNode;
};

export function CardHeader({ children }: CardHeaderProps) {
  return (
    <div className="flex w-full t justify-center items-center gap-1 p-1 bg-white">
      {children}
    </div>
  );
}

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={twMerge(
        "relative flex flex-col min-w-50 w-50 h-75 rounded-lg box-border border-2 border-amber-400 bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
