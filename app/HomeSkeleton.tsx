export default function HomeSkeleton() {
	return (
		<div className="flex flex-col justify-center m-auto w-full p-6 min-h-[calc(100vh-var(--header-height))]">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col border-primary rounded-[20px] p-6 border-solid border-l-[3px] border-0 gap-1 max-w-4xl w-full">
					{/* "Hello it's me" */}
					<div className="h-5 w-32 rounded bg-muted animate-pulse" />
					{/* Username */}
					<div className="h-10 w-64 rounded bg-muted animate-pulse mt-1 ml-2" />
					{/* "And i'm a ..." */}
					<div className="h-6 w-48 rounded bg-muted animate-pulse ml-2" />

					<div className="flex flex-col ml-2 gap-6 mt-2">
						{/* Intro text */}
						<div className="flex flex-col gap-2">
							<div className="h-4 w-full rounded bg-muted animate-pulse" />
							<div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
							<div className="h-4 w-4/6 rounded bg-muted animate-pulse" />
						</div>
						{/* Icon links */}
						<div className="flex gap-2">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="w-10 h-10 rounded-full bg-muted animate-pulse" />
							))}
						</div>
						{/* Button */}
						<div className="h-10 w-40 rounded-lg bg-muted animate-pulse" />
					</div>
				</div>
			</div>
		</div>
	);
}
