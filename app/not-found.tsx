import Image from "next/image";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-6">
			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-col sm:flex-row m-auto relative w-full">

					<div className="text-center flex flex-col xs:hidden">
						<h1 className="text-4xl md:text-6xl font-bold md:mb-2">404</h1>
						<h2 className="text-1xl md:text-2xl font-semibold md:mb-2">Page Not Found</h2>
						<p className="text-muted-foreground mb-6">
							The page you are looking for does not exist or has been moved.
						</p>
					</div>

					<div className="px-5">
						<Image
							className="h-full w-full m-auto rounded-xl max-w-md hidden xxs:flex"
							src="/images/confused.png"
							alt="Not found"
							sizes="100vw"
							width={0}
							height={0}
						/>
					</div>
					<div className="text-center absolute left-7/12 right-0 hidden xs:flex flex-col">
						<h1 className="text-4xl md:text-6xl font-bold md:mb-2">404</h1>
						<h2 className="text-1xl md:text-2xl font-semibold md:mb-2">Page Not Found</h2>
						<p className="text-muted-foreground mb-6">
							The page you are looking for does not exist or has been moved.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}