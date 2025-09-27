"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BaseInput, { type InputProps as BaseInputProps } from "@/components/ui/Input";

export interface MoneyInputProps
  extends Omit<BaseInputProps, "type" | "onChange" | "value" | "defaultValue"> {
  value?: number | null;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
  onRawChange?: (raw: string) => void; // raw display string while typing
  locale?: string; // e.g., 'vi-VN'
  currency?: string; // e.g., 'VND'
  currencySymbol?: boolean; // show symbol on blur
  decimalScale?: number; // number of fraction digits (default 0 for VND)
  allowNegative?: boolean;
  min?: number;
  max?: number;
  step?: number; // used for keyboard arrows
  formatOnBlur?: boolean; // if true, group and add symbol on blur
}

const getSeparators = (locale: string) => {
  const numberWithDecimal = new Intl.NumberFormat(locale).format(1.1);
  const numberWithGroup = new Intl.NumberFormat(locale).format(1000);
  const decimal = numberWithDecimal.replace(/[\d\s\u00A0]/g, "");
  const group = numberWithGroup.replace(/[\d\s\u00A0]/g, "");
  return {
    decimal: decimal || ".",
    group: group || ",",
    space: "\u00A0",
  };
};

const clamp = (val: number, min?: number, max?: number) => {
  if (min != null && val < min) return min;
  if (max != null && val > max) return max;
  return val;
};

const parseLocaleNumber = (raw: string, locale: string, allowNegative: boolean, decimalScale: number): number | null => {
  if (!raw) return null;
  const { decimal, group } = getSeparators(locale);
  // Remove group separators and spaces
  let cleaned = raw
    .replace(new RegExp("[" + group + "]", "g"), "")
    .replace(/\s|\u00A0/g, "");

  // Normalize decimal to '.'
  if (decimal !== ".") cleaned = cleaned.replace(new RegExp("\\" + decimal, "g"), ".");

  // Keep only valid characters
  cleaned = cleaned.replace(/[^0-9.\-]/g, "");

  // Handle negatives
  if (!allowNegative) cleaned = cleaned.replace(/\-/g, "");
  else cleaned = cleaned.replace(/(?!^)-/g, "");

  // Limit to one decimal point
  const parts = cleaned.split(".");
  if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");

  // Enforce decimal scale
  if (decimalScale >= 0 && cleaned.includes(".")) {
    const [i, f] = cleaned.split(".");
    cleaned = i + "." + f.slice(0, decimalScale);
  }

  if (cleaned === "" || cleaned === "-") return null;
  const num = Number(cleaned);
  if (Number.isNaN(num)) return null;
  return num;
};

const formatDisplay = (
  value: number,
  locale: string,
  decimalScale: number,
  currency?: string,
  withCurrency?: boolean
) => {
  if (withCurrency && currency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: decimalScale,
      maximumFractionDigits: decimalScale,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    useGrouping: true,
    minimumFractionDigits: decimalScale,
    maximumFractionDigits: decimalScale,
  }).format(value);
};

const ungroupForEditing = (display: string, locale: string): string => {
  const { group, space } = getSeparators(locale);
  return display.replace(new RegExp("[" + group + space + "]", "g"), "").replace(/[^0-9,.-]/g, "");
};

export default function MoneyInput({
  value,
  defaultValue,
  onChange,
  onRawChange,
  locale = "vi-VN",
  currency = "VND",
  currencySymbol = false,
  decimalScale,
  allowNegative = false,
  min,
  max,
  step = 1,
  formatOnBlur = true,
  label,
  helperText,
  error,
  icon,
  variant,
  size,
  className,
  onBlur,
  onFocus,
  onKeyDown,
  ...rest
}: MoneyInputProps) {
  // Default decimals: 0 for VND, else 2
  const scale = decimalScale ?? (currency === "VND" ? 0 : 2);
  const isControlled = value !== undefined;

  const initialNumber = useMemo(() => {
    if (isControlled) return value ?? null;
    if (defaultValue !== undefined) return defaultValue;
    return null;
  }, [isControlled, value, defaultValue]);

  const [display, setDisplay] = useState<string>(
    initialNumber != null ? formatDisplay(initialNumber, locale, scale, currency, formatOnBlur && currencySymbol) : ""
  );

  // Sync when controlled value changes
  useEffect(() => {
    if (isControlled) {
      const v = value;
      if (v == null) setDisplay("");
      else setDisplay(formatDisplay(v, locale, scale, currency, formatOnBlur && currencySymbol));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, locale, scale, currency, formatOnBlur, currencySymbol]);

  const updateValue = useCallback(
    (nextRaw: string) => {
      // Parse numeric value from raw
      const parsed = parseLocaleNumber(nextRaw, locale, allowNegative, scale);
      const clamped = parsed != null ? clamp(parsed, min, max) : null;

      if (!isControlled) {
        if (formatOnBlur) {
          // While typing, keep raw (no grouping) for better UX
          setDisplay(nextRaw);
        } else {
          // Live format with grouping (caret moves to end)
          setDisplay(
            clamped != null ? formatDisplay(clamped, locale, scale) : nextRaw
          );
        }
      }

      onRawChange?.(nextRaw);
      onChange?.(clamped);
    },
    [allowNegative, formatOnBlur, isControlled, locale, max, min, onChange, onRawChange, scale]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value;
      const { decimal, group } = getSeparators(locale);

      // Build a regex to keep digits, one decimal, optional leading minus
      let raw = inputVal
        // remove currency symbols or letters
        .replace(/[^0-9,.-\s\u00A0]/g, "")
        // drop group separators
        .replace(new RegExp("[" + group + "]", "g"), "");

      // Allow only one decimal separator and optional leading minus
      const isNeg = /^-/.test(raw) && allowNegative;
      raw = raw.replace(/-/g, "");
      if (isNeg) raw = "-" + raw;

      const decEsc = decimal === "." ? "\\." : decimal;
      const parts = raw.split(new RegExp(decEsc, "g"));
      if (parts.length > 2) raw = parts[0] + decimal + parts.slice(1).join("");

      // Enforce decimal scale while typing
      if (scale >= 0 && raw.includes(decimal)) {
        const [i, f] = raw.split(decimal);
        raw = i + decimal + f.slice(0, scale);
      }

      updateValue(raw);
    },
    [allowNegative, locale, scale, updateValue]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (formatOnBlur) {
        const numeric = parseLocaleNumber(display, locale, allowNegative, scale);
        const clamped = numeric != null ? clamp(numeric, min, max) : null;
        setDisplay(
          clamped != null
            ? formatDisplay(clamped, locale, scale, currency, currencySymbol)
            : ""
        );
        onChange?.(clamped);
      }
      onBlur?.(e);
    },
    [allowNegative, currency, currencySymbol, display, formatOnBlur, locale, max, min, onBlur, onChange, scale]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (formatOnBlur && display) {
        setDisplay(ungroupForEditing(display, locale));
      }
      onFocus?.(e);
    },
    [display, formatOnBlur, locale, onFocus]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (step && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        const current = parseLocaleNumber(display, locale, allowNegative, scale) || 0;
        const delta = e.key === "ArrowUp" ? step : -step;
        const next = clamp(current + delta, min, max);
        const nextStr = formatOnBlur
          ? ungroupForEditing(formatDisplay(next, locale, scale), locale)
          : formatDisplay(next, locale, scale);
        setDisplay(nextStr);
        onChange?.(next);
      }
      onKeyDown?.(e);
    },
    [allowNegative, display, formatOnBlur, locale, max, min, onChange, scale, step, onKeyDown]
  );

  return (
    <BaseInput
      {...rest}
      type="text"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      label={label}
      helperText={helperText}
      error={error}
      icon={icon}
      variant={variant}
      size={size}
      className={className}
      inputMode={scale > 0 ? "decimal" : "numeric"}
      placeholder={rest.placeholder ?? (currencySymbol ? formatDisplay(0, locale, scale, currency, true) : formatDisplay(0, locale, scale))}
    />
  );
}

