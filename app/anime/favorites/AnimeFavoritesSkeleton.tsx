import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AnimeFavoritesSkeleton() {
	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="flex flex-col gap-5 md:my-14 w-full">
					{/* Favorite anime card */}
					<Card className="w-full h-full py-0">
						<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row h-24">
							<div className="flex flex-1 flex-col gap-2 px-6 py-2 my-auto">
								<div className="h-5 w-56 rounded bg-muted animate-pulse" />
								<div className="h-3 w-72 rounded bg-muted animate-pulse" />
							</div>
						</CardHeader>
						<CardContent className="p-6 grid gap-4 place-items-center grid-cols-1 xl:grid-cols-2 xxl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 5xl:grid-cols-6">
							{[...Array(6)].map((_, i) => (
								<div key={i} className="w-full rounded-xl bg-muted animate-pulse h-40" />
							))}
						</CardContent>
					</Card>

					{/* Favorite characters card */}
					<Card className="w-full h-full py-0">
						<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row h-24">
							<div className="flex flex-1 flex-col gap-2 px-6 py-2 my-auto">
								<div className="h-5 w-40 rounded bg-muted animate-pulse" />
								<div className="h-3 w-48 rounded bg-muted animate-pulse" />
							</div>
						</CardHeader>
						<CardContent className="p-6 flex flex-wrap gap-4 justify-center">
							{[...Array(8)].map((_, i) => (
								<div key={i} className="flex flex-col items-center gap-4 p-5 rounded-xl bg-card-inner">
									<div
										className="w-50 h-50 rounded-full bg-muted animate-pulse"
										style={{ width: "10rem", height: "10rem" }}
									/>
									<div className="h-4 w-28 rounded bg-muted animate-pulse" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
