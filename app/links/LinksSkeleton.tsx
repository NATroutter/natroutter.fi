import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonLinkCard() {
	return (
		<Card className="w-full h-full py-0">
			<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row h-24">
				<div className="flex flex-1 flex-col gap-2 px-6 py-2 my-auto">
					<div className="h-5 w-32 rounded bg-muted animate-pulse" />
					<div className="h-3 w-48 rounded bg-muted animate-pulse" />
				</div>
			</CardHeader>
			<CardContent className="p-2">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="flex p-1.5 m-3">
						<div className="flex w-full h-full p-2 bg-card-inner rounded-lg gap-3">
							<div className="w-20 h-20 rounded-lg bg-muted animate-pulse flex-shrink-0" />
							<div className="flex flex-col gap-2 justify-center flex-1">
								<div className="h-5 w-36 rounded bg-muted animate-pulse" />
								<div className="h-3 w-52 rounded bg-muted animate-pulse" />
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

export default function LinksSkeleton() {
	return (
		<div className="flex flex-col justify-center m-auto w-full p-6">
			<div className="gap-5 md:my-14 w-full max-w-[90vw] 2xl:w-640 grid self-center place-items-center grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 2lg:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 4xl:3xl:grid-cols-5">
				{[...Array(3)].map((_, i) => (
					<SkeletonLinkCard key={i} />
				))}
			</div>
		</div>
	);
}
