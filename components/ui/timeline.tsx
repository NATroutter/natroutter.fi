"use client";

import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

// Types
type TimelineContextValue = {
	activeStep: number;
	setActiveStep: (step: number) => void;
};

// Context
const TimelineContext = React.createContext<TimelineContextValue | undefined>(undefined);

const useTimeline = () => {
	const context = React.useContext(TimelineContext);
	if (!context) {
		throw new Error("useTimeline must be used within a Timeline");
	}
	return context;
};

// Components
interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
	defaultValue?: number;
	value?: number;
	onValueChange?: (value: number) => void;
}

function Timeline({ defaultValue = 1, value, onValueChange, className, ...props }: TimelineProps) {
	const [activeStep, setInternalStep] = React.useState(defaultValue);

	const setActiveStep = React.useCallback(
		(step: number) => {
			if (value === undefined) {
				setInternalStep(step);
			}
			onValueChange?.(step);
		},
		[value, onValueChange],
	);

	const currentStep = value ?? activeStep;

	return (
		<TimelineContext.Provider value={{ activeStep: currentStep, setActiveStep }}>
			<div data-slot="timeline" className={cn("group/timeline flex flex-col", className)} {...props} />
		</TimelineContext.Provider>
	);
}

// TimelineContent
function TimelineContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div data-slot="timeline-content" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

// TimelineDate
interface TimelineDateProps extends React.HTMLAttributes<HTMLTimeElement> {
	asChild?: boolean;
}

function TimelineDate({ asChild = false, className, ...props }: TimelineDateProps) {
	const Comp = asChild ? Slot.Root : "time";

	return (
		<Comp
			data-slot="timeline-date"
			className={cn("text-muted-muted mt-1 block text-xs font-medium max-sm:h-4", className)}
			{...props}
		/>
	);
}

// TimelineHeader
function TimelineHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div data-slot="timeline-header" className={cn(className)} {...props} />;
}

// TimelineIndicator
interface TimelineIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
	asChild?: boolean;
}

function TimelineIndicator({ asChild = false, className, children, ...props }: TimelineIndicatorProps) {
	return (
		<div
			data-slot="timeline-indicator"
			className={cn("absolute top-0 -left-6 -translate-x-1/2 size-4 rounded-full border-2", className)}
			aria-hidden="true"
			{...props}
		>
			{children}
		</div>
	);
}

// TimelineItem
interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
	step: number;
}

function TimelineItem({ step, className, ...props }: TimelineItemProps) {
	const { activeStep } = useTimeline();

	return (
		<div
			data-slot="timeline-item"
			className={cn(
				"group/timeline-item [&_[data-slot=timeline-separator]]:bg-neutral-500 relative flex flex-1 flex-col gap-0.5 not-last:pb-5",
				className,
			)}
			data-completed={step <= activeStep || undefined}
			{...props}
		/>
	);
}

// TimelineSeparator
function TimelineSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="timeline-separator"
			className={cn(
				"absolute self-start group-last/timeline-item:hidden -left-6 h-[calc(100%-1rem-0.25rem)] w-0.5 -translate-x-1/2 translate-y-4.5",
				className,
			)}
			aria-hidden="true"
			{...props}
		/>
	);
}

// TimelineTitle
function TimelineTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return <h3 data-slot="timeline-title" className={cn("text-sm font-medium", className)} {...props} />;
}

export {
	Timeline,
	TimelineContent,
	TimelineDate,
	TimelineHeader,
	TimelineIndicator,
	TimelineItem,
	TimelineSeparator,
	TimelineTitle,
};
