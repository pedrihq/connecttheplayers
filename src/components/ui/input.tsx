import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv, VariantProps } from "tailwind-variants";

type InputProps = ComponentProps<"input"> & InputVariants;
type FieldGroupProps = ComponentProps<"div">;

const input = tv({
  base: "bg-transparent text-white text-2xl border-white border p-1.5 outline-0 uppercase font-bold w-full",
  variants: {
    disabled: {
      true: "opacity-50 cursor-not-allowed",
    },
  },
});

type InputVariants = VariantProps<typeof input>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={twMerge(input({ disabled: rest.disabled }), className)}
      {...rest}
    />
  );
});

Input.displayName = "Input";

export default Input;

export function FieldGroup({ className, ...rest }: FieldGroupProps) {
  return (
    <div className={twMerge(className, "flex flex-row w-full")} {...rest} />
  );
}
