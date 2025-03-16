// components/ui/multi-select.tsx
"use client";
import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MultiSelectProps {
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  creatable?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  values,
  onChange,
  placeholder = "Select items...",
  creatable = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (item: string) => {
    onChange(values.filter((i) => i !== item));
  };

  const handleSelect = (item: string) => {
    if (values.includes(item)) {
      onChange(values.filter((i) => i !== item));
    } else {
      onChange([...values, item]);
    }
    setInputValue("");
  };

  const handleCreateOption = (value: string) => {
    if (
      value.trim() !== "" &&
      !options.includes(value) &&
      !values.includes(value)
    ) {
      onChange([...values, value]);
      setInputValue("");
    }
  };

  const displayOptions = React.useMemo(() => {
    const allOptions = [...options];
    if (
      creatable &&
      inputValue.trim() !== "" &&
      !allOptions.includes(inputValue)
    ) {
      allOptions.push(inputValue);
    }
    return allOptions;
  }, [options, creatable, inputValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex gap-1 flex-wrap">
            {values.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {values.map((item) => (
              <Badge key={item} variant="secondary" className="mr-1 mb-1">
                {item}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUnselect(item);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search items..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>
            {creatable ? (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleCreateOption(inputValue)}
              >
                Add {inputValue}
              </Button>
            ) : (
              <span>No items found.</span>
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {displayOptions.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={() => handleSelect(item)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    values.includes(item) ? "opacity-100" : "opacity-0"
                  )}
                />
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
