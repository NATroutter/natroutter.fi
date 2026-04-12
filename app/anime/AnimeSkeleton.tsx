import { Card } from "@/components/ui/card";

function SkeletonCard({ className }: { className?: string }) {
	return (
		<Card className={className}>
			<div className="p-6 border-b border-card-border">
				<div className="h-5 w-40 rounded bg-muted animate-pulse" />
				<div className="h-3 w-56 rounded bg-muted animate-pulse mt-2" />
			</div>
			<div className="p-6">
				<div className="h-48 rounded bg-muted animate-pulse" />
			</div>
		</Card>
	);
}

export default function AnimeSkeleton() {
	return (
		<div className="flex flex-col justify-center mx-auto w-full p-6">
			<div className="w-full max-w-[90vw] 2xl:w-640 flex flex-col self-center place-items-center">
				<div className="w-full flex flex-col gap-5 md:my-14">
					{/* Quick stats */}
					<SkeletonCard />
					{/* Seasons best */}
					<SkeletonCard />
					{/* Activity map */}
					<SkeletonCard />

					{/* 4-col grid x2 */}
					<div className="grid place-content-between gap-5 grid-cols-1 sm:grid-cols-2 xxl:grid-cols-4">
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
					</div>
					<div className="grid place-content-between gap-5 grid-cols-1 sm:grid-cols-2 xxl:grid-cols-4">
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
					</div>

					{/* Flex rows */}
					<div className="flex flex-col lg:flex-row gap-5 w-full">
						<SkeletonCard className="flex-1" />
						<SkeletonCard className="flex-1" />
					</div>
					<div className="flex flex-col lg:flex-row gap-5 w-full">
						<SkeletonCard className="flex-1" />
						<SkeletonCard className="flex-1" />
					</div>

					{/* Source */}
					<SkeletonCard />

					<div className="flex flex-col lg:flex-row gap-5 w-full">
						<SkeletonCard className="flex-1" />
						<SkeletonCard className="flex-1" />
					</div>
					<div className="flex flex-col lg:flex-row gap-5 w-full">
						<SkeletonCard className="flex-1" />
					</div>
				</div>
			</div>
		</div>
	);
}
