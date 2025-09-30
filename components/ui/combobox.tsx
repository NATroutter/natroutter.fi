"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboEntry {
	value: string;
	label: string;
}

interface ComboboxProps<T extends ComboEntry> {
	placeholder: string
	comboData: T[]
	onSelect?: (value: string) => void
	defaultValue?: string
}

export default function Combobox<T extends ComboEntry>({ placeholder, comboData, onSelect , defaultValue} : ComboboxProps<T>) {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState(defaultValue ?? "")

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value
						? comboData.find((entry) => entry.value === value)?.label
						: placeholder}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandEmpty>No entries found.</CommandEmpty>
						<CommandGroup>
							{comboData.map((entry) => (
								<CommandItem
									key={entry.value}
									value={entry.value}
									onSelect={(currentValue) => {
										const newValue = currentValue === value ? "" : currentValue
										setValue(newValue)
										setOpen(false)
										onSelect?.(newValue)
									}}
								>
									<CheckIcon
										className={cn(
											"mr-2 h-4 w-4",
											value === entry.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{entry.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}