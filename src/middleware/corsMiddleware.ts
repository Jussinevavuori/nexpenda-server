import * as cors from "cors";

export function corsMiddleware() {
	return cors({
		credentials: true,
		origin:true,
	})
}
