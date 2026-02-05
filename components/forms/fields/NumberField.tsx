"use client";

import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface NumberFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number | string;
  disabled?: boolean;
}

function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  min,
  max,
  step,
  disabled,
}: NumberFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              name={field.name}
              onBlur={field.onBlur}
              ref={field.ref}
              value={String(field.value ?? "")}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { NumberField };
export type { NumberFieldProps };
