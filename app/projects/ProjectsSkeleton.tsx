import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProjectsSkeleton() {
	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col gap-5 md:my-14 w-full">
					<Card className="w-full h-full py-0">
						<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row h-24">
							<div className="flex flex-1 flex-col gap-2 px-6 py-2 my-auto">
								<div className="h-5 w-32 rounded bg-muted animate-pulse" />
								<div className="h-3 w-56 rounded bg-muted animate-pulse" />
							</div>
						</CardHeader>
						<CardContent className="p-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
							{[...Array(6)].map((_, i) => (
								<div key={i} className="flex p-1.5 m-1 sm:m-2 md:m-3">
									<div className="flex w-full h-full p-2 bg-card-inner rounded-lg gap-3">
										<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted animate-pulse flex-shrink-0" />
										<div className="flex flex-col gap-2 justify-center flex-1">
											<div className="h-5 w-32 rounded bg-muted animate-pulse" />
											<div className="h-3 w-44 rounded bg-muted animate-pulse" />
										</div>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
