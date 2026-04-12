export default function AboutSkeleton() {
	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col gap-5 md:my-20 w-full">
					{/* Mobile image */}
					<div className="flex 2xl:hidden w-full m-auto p-5">
						<div className="h-64 w-64 rounded-full bg-muted animate-pulse mx-auto" />
					</div>

					<div className="flex flex-col lg:flex-row">
						{/* About text */}
						<div className="text-left w-full max-w-lg p-5 border-primary rounded-[20px] border-solid border-l-[3px] border-0">
							<div className="h-8 w-48 rounded bg-muted animate-pulse mb-4" />
							<div className="flex flex-col gap-2">
								{[...Array(6)].map((_, i) => (
									<div
										key={i}
										className="h-4 rounded bg-muted animate-pulse"
										style={{ width: `${85 + (i % 3) * 5}%` }}
									/>
								))}
							</div>
						</div>

						{/* Desktop image */}
						<div className="hidden 2xl:flex w-full min-w-lg max-w-lg my-auto p-5">
							<div className="h-full w-full aspect-square rounded-full bg-muted animate-pulse" />
						</div>

						{/* Skills text */}
						<div className="text-left w-full max-w-lg mt-5 lg:mt-0 p-5 border-primary rounded-[20px] border-solid border-r-[3px] border-0">
							<div className="h-8 w-32 rounded bg-muted animate-pulse mb-4" />
							<div className="flex flex-col gap-2">
								{[...Array(8)].map((_, i) => (
									<div
										key={i}
										className="h-4 rounded bg-muted animate-pulse"
										style={{ width: `${70 + (i % 4) * 7}%` }}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
