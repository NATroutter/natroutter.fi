import { getFooterData } from "@/lib/database";

export const revalidate = 60;

export async function GET() {
	const data = await getFooterData();
	if (!data) {
		return Response.json({ error: "Failed to fetch footer data" }, { status: 503 });
	}
	return Response.json(data);
}
