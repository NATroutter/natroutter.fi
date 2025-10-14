function ErrorPage(name: string, message: string, location?: string) {
	return (
		<div className="flex flex-col justify-center m-auto w-full p-6 min-h-[calc(100vh-var(--header-height))]">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col gap-5">
					<div className="flex flex-col justify-center m-auto text-center">
						<h1 className="text-4xl font-bold">{name}!</h1>
						<p className="mt-2 text-muted">
							{location && (
								<span className="font-semibold">
									{location}
									<span className="font-normal"> : </span>
								</span>
							)}
							{message}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ConfigError() {
	return ErrorPage("Config Error", "Application is not configured correctly");
}

export function ContentError({ location }: { location: string }) {
	return ErrorPage("Content Error", `Failed to fetch content from backend server`, location);
}
