'use client'

import {AnimeEntry} from "@/types/animeData";
import * as React from "react";
import {ReactNode, useMemo, useState} from "react";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";
import {ScrollArea} from "@/components/ui/scroll-area";

export interface ChartSettings {
	viewingYear: string;
}

export const defaultSettings : ChartSettings = {
	viewingYear: "all"
}

interface ChartSettingsProps  {
	animeData: AnimeEntry[]
	settings: ChartSettings;
	onSettingsSave: (value: ChartSettings) => void
	children?: ReactNode;
}

export default function ChartSettingsDialog({animeData, onSettingsSave, settings, children }: ChartSettingsProps) {
	const [tempSettings, setTempSettings] = useState<ChartSettings>(settings)

	const handleSave = () => {
		onSettingsSave(tempSettings)
		toast.success("Settings saved successfully", {
			position: "top-center",
		})
	}

	const availableYears = useMemo(() => {
		const yearsSet = new Set<number>()

		for (const anime of animeData) {
			const updatedAt = anime.list_status?.updated_at
			if (!updatedAt) continue
			const year = new Date(updatedAt).getFullYear()
			yearsSet.add(year)
		}
		return ["All", ...Array.from(yearsSet).sort((a, b) => b - a)]
	}, [animeData])

	return (
		<Dialog onOpenChange={(open) => open && setTempSettings(settings)}>
			<DialogTrigger asChild>
				{children ? (children) : (<Button variant="outline">Settings</Button>)}
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-4 p-0 min-w-[20vw] max-h-[90vh] w-full">
				<DialogHeader className="flex-col gap-0 border-b border-border p-4">
					<DialogTitle className="py-2">Charts & Graphs Settings</DialogTitle>
					<DialogDescription>
						Make changes how to charts and graphs are displayed. Click save when you&apos;re
						done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 p-4">
					<div className="grid gap-3">
						<Label htmlFor="name-1">Viewing Year</Label>
						<Select value={tempSettings.viewingYear} onValueChange={(value) => setTempSettings({...tempSettings, viewingYear: value})}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Year" />
							</SelectTrigger>
							<SelectContent>
								{availableYears.map((value, index) =>
									<SelectItem key={index} value={value.toString().toLowerCase()}>{value}</SelectItem>
								)}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter className="flex-row items-center justify-end border-t border-border p-4">
					<DialogClose asChild>
						<Button variant="outline" onClick={handleSave}>Save changes</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
