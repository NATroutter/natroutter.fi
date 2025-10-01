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
	className?: string
	CheckMark?: boolean
}

export default function Combobox<T extends ComboEntry>({ placeholder, comboData, onSelect, className, CheckMark = true} : ComboboxProps<T>) {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState(comboData[0].value)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("w-[200px] justify-center p-1.5", className)}
				>
					<div className="flex flex-row m-auto justify-between w-full">
						<span className="text-left my-auto">{value ? comboData.find((entry) => entry.value === value)?.label : placeholder}</span>
						<ChevronsUpDownIcon className="my-auto h-4 w-4 shrink-0 opacity-50" />
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("w-[200px] p-0", className)}>
				<Command>
					<CommandList>
						<CommandEmpty>No entries found.</CommandEmpty>
						<CommandGroup>
							{comboData.map((entry) => (
								<CommandItem
									key={entry.value}
									value={entry.value}
									onSelect={(currentValue) => {
										const newValue = currentValue === value ? comboData[0].value : currentValue
										setValue(newValue)
										setOpen(false)
										onSelect?.(newValue)
									}}
								>
									{CheckMark && (
										<CheckIcon
											className={cn(
												"mr-2 h-4 w-4", value === entry.value ? "opacity-100" : "opacity-0"
											)}
										/>
									)}
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