'use client'

import * as React from "react"

export function Box({children}: Readonly<{ children: React.ReactNode; }>) {

// @apply border-[color:var(--ThemeColor)] mx-auto my-60 p-[25px] rounded-lg border-[3px];
// 	border-style: none none none solid;
//
	return (
		<div className="flex flex-col justify-center m-auto p-7">
			<div className="border-theme p-7 rounded-[10px] boxBorder border-solid border-l-[3px] border-0">
				{children}
			</div>
		</div>
	)
}
