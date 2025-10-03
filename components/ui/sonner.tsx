"use client"

import {Toaster as Sonner} from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme={"dark"}
			className="toaster group"
			closeButton={true}
			position={"top-center"}
			toastOptions={{
				classNames: {
					toast: 'bg-card! border-card-border! group',

					closeButton: `
						bg-card! border-card-border!
						[.group[data-type=success]_&]:bg-toast-success-bg! [.group[data-type=success]_&]:border-toast-success-border! [.group[data-type=success]_&]:text-toast-success-text!
						[.group[data-type=error]_&]:bg-toast-error-bg! [.group[data-type=error]_&]:border-toast-error-border! [.group[data-type=error]_&]:text-toast-error-text!
						[.group[data-type=warning]_&]:bg-toast-warn-bg! [.group[data-type=warning]_&]:border-toast-warn-border! [.group[data-type=warning]_&]:text-toast-warn-text!
						[.group[data-type=info]_&]:bg-toast-info-bg! [.group[data-type=info]_&]:border-toast-info-border! [.group[data-type=info]_&]:text-toast-info-text!
					`,
					description:`
						text-text/60!
						[.group[data-type=error]_&]:text-toast-error-text/60!
						[.group[data-type=success]_&]:text-toast-success-text/60!
						[.group[data-type=warning]_&]:text-toast-warn-text/60!
						[.group[data-type=info]_&]:text-toast-info-text/60!
					`,

					actionButton: `
						bg-card-inner! text-text!
						[.group[data-type=error]_&]:bg-toast-error-border/60!
						[.group[data-type=success]_&]:bg-toast-success-border/60!
						[.group[data-type=warning]_&]:bg-toast-warn-border/60!
						[.group[data-type=info]_&]:bg-toast-info-border/60!
					`,

					cancelButton: `
						bg-card-inner! text-text!
						[.group[data-type=error]_&]:bg-toast-error-border/60!
						[.group[data-type=success]_&]:bg-toast-success-border/60!
						[.group[data-type=warning]_&]:bg-toast-warn-border/60!
						[.group[data-type=info]_&]:bg-toast-info-border/60!
					`,

					error: 'bg-toast-error-bg! border-toast-error-border! text-toast-error-text!',
					success: 'bg-toast-success-bg! border-toast-success-border! text-toast-success-text!',
					warning: 'bg-toast-warn-bg! border-toast-warn-border! text-toast-warn-text!',
					info: 'bg-toast-info-bg! border-toast-info-border! text-toast-info-text!',
				},
			}}
			{...props}
		/>
	)
}

export { Toaster }
