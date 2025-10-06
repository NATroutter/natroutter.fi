import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
	useRing?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, useRing = true, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-9 w-full rounded-md border border-popover-border bg-popover focus:bg-popover-focus px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					useRing && "focus-visible:ring-2 focus-visible:ring-primary",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
