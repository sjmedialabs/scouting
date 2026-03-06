"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchableSelectOption {
  value: string
  label: string
}

interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select option",
  emptyText = "No results found",
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!query) return options
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase())
    )
  }, [options, query])

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ?? ""

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "h-12 w-full justify-between rounded-xl border border-gray-300 bg-white px-4 text-sm",
            "focus:border-orange-500 focus:ring-0",
            className
          )}
        >
          {value ? (
            <span className="text-gray-700 truncate">{selectedLabel}</span>
          ) : (
            <span className="text-gray-400 text-xs">{placeholder}</span>
          )}

          {value ? (
            <X
              className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onValueChange("")
                setQuery("")
              }}
            />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Search...`}
            value={query}
            autoFocus
            onValueChange={setQuery}
            onKeyDown={(e) => e.stopPropagation()}
          />

          <CommandEmpty>{emptyText}</CommandEmpty>

          <CommandGroup>
            {filteredOptions.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.value}
                onSelect={() => {
                  onValueChange(opt.value)
                  setOpen(false)
                  setQuery("")
                }}
              >
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
