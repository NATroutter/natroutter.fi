function timestamp(): string {
	const now = new Date();
	return `${now.getDay()}:${now.getMonth()}:${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

function print(message: string) {
	if (process.env.NODE_ENV === "development") {
		console.log(message);
	} else {
		process.stdout.write(`${message}\n`);
	}
}

const logger = {
	error(message: string) {
		print(`[${timestamp()}][ERROR]${message}`);
	},
	warn(message: string) {
		print(`[${timestamp()}][WARN]${message}`);
	},
	info(message: string) {
		print(`[${timestamp()}][INFO]${message}`);
	},
	log(message: string) {
		print(`[${timestamp()}]${message}`);
	},
};
export default logger;
