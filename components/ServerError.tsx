export interface ServerErrorProps {
	reason?: string;
	location?: string;
	type: "config" | "content";
}

export default function ServerError({ reason, location, type }: ServerErrorProps) {
	let errorType = "";
	switch (type) {
		case "config":
			errorType = "Application is not configured correctly";
			break;
		case "content":
			errorType = "Failed to fetch content from backend";
	}

	return (
		<div className="flex flex-col justify-center m-auto w-full p-6 min-h-[calc(100vh-var(--header-height))]">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col gap-5">
					<div className="flex flex-col justify-center m-auto text-center">
						<h1 className="text-4xl font-bold">Server Error</h1>
						<p>
							{errorType}
							{location && ` (${location})`}
						</p>
						{reason && <p className="mt-2 text-gray-600">{reason}</p>}
					</div>
				</div>
			</div>
		</div>
	);
}
