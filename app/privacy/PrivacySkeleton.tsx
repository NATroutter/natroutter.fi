import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PrivacySkeleton() {
	return (
		<div className="flex flex-col justify-center m-auto w-full p-6">
			<div className="gap-5 md:my-20 w-full max-w-[90vw] 2xl:w-640 grid self-center place-items-center">
				<Card className="w-full h-full py-0">
					<CardHeader className="flex flex-col items-stretch p-0 sm:flex-row h-24">
						<div className="flex flex-1 flex-col items-center justify-center px-6 py-2">
							<div className="h-8 w-48 rounded bg-muted animate-pulse" />
						</div>
					</CardHeader>
					<CardContent className="flex flex-col p-6 gap-5">
						<div className="flex flex-col gap-2">
							<div className="h-4 w-48 rounded bg-muted animate-pulse" />
							<div className="h-4 w-44 rounded bg-muted animate-pulse" />
						</div>
						<div className="flex flex-col gap-2">
							{[...Array(12)].map((_, i) => (
								<div key={i} className="h-4 rounded bg-muted animate-pulse" style={{ width: `${70 + (i % 5) * 6}%` }} />
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
