import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AnimeListSkeleton() {
	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="gap-5 md:my-14 w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<Card className="w-full h-full">
					<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row">
						<div className="flex flex-1 flex-col gap-2 px-6 pb-3 pt-4">
							<div className="h-5 w-32 rounded bg-muted animate-pulse" />
							<div className="h-3 w-56 rounded bg-muted animate-pulse" />
						</div>
					</CardHeader>
					<CardContent className="flex flex-col p-0">
						<div className="flex flex-col p-6 gap-2">
							{/* List type selector */}
							<div className="flex gap-2 flex-wrap">
								{[...Array(5)].map((_, i) => (
									<div key={i} className="h-8 w-28 rounded-full bg-muted animate-pulse" />
								))}
							</div>
							{/* Search + sort */}
							<div className="flex gap-2 flex-wrap">
								<div className="h-9 w-64 rounded-lg bg-muted animate-pulse" />
								<div className="h-9 w-36 rounded-lg bg-muted animate-pulse" />
							</div>
							{/* Count info */}
							<div className="h-4 w-40 rounded bg-muted animate-pulse" />
						</div>

						<hr className="border-card-border" />

						<div className="w-full p-6 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{[...Array(12)].map((_, i) => (
								<div key={i} className="rounded-lg bg-muted animate-pulse h-24" />
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
