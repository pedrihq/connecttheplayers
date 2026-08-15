import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { tv, VariantProps } from "tailwind-variants";

type ButtonProps = ComponentProps<"button"> & ButtonVariants;

const button = tv({
  base: "flex items-center justify-center gap-2 bg-transparent text-white text-2xl border-white border p-1.5 outline-0 uppercase font-bold cursor-pointer ",
  variants: {
    disabled: {
      true: "opacity-50 cursor-not-allowed",
      false: 'active:bg-black/90'
    },
  },
});

type ButtonVariants = VariantProps<typeof button>;

export default function Button({ className, ...rest }: ButtonProps) {
  return (
    <button
      className={twMerge(className, button({ disabled: rest.disabled }))}
      {...rest}
    />
  );
}
