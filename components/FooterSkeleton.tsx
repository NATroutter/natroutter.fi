/** biome-ignore-all lint/suspicious/noArrayIndexKey: <skeleton component> */
export default function FooterSkeleton() {
	return (
		<footer className="bg-footer border-t border-footer-border">
			<div className="flex flex-col justify-center m-auto my-5">
				<div className="grid place-self-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-[90vw] 2xl:w-640 place-items-center">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="flex flex-col gap-2 max-w-80 px-5 py-3 w-full h-full">
							<div className="h-7 w-32 rounded bg-muted animate-pulse" />
							<div className="flex flex-col ml-2 gap-3 mt-1">
								{[...Array(4)].map((_, j) => (
									<div key={j} className="flex gap-2 items-center">
										<div className="w-7 h-7 rounded bg-muted animate-pulse flex-shrink-0" />
										<div className="h-4 w-28 rounded bg-muted animate-pulse" />
									</div>
								))}
							</div>
						</div>
					))}
				</div>
				<div className="flex flex-col justify-center text-center p-5 gap-1">
					<div className="h-3 w-24 rounded bg-muted animate-pulse mx-auto" />
					<div className="h-3 w-40 rounded bg-muted animate-pulse mx-auto mt-1" />
				</div>
			</div>
		</footer>
	);
}
