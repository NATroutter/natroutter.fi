function timestamp() : string {
	const now = new Date();
	return `${now.getDay()}.${now.getMonth()}.${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}`;
}

function print(message: string) {
	if (process.env.NODE_ENV === 'development') {
		console.log(message)
	} else {
		process.stdout.write(message+"\n")
	}
}

const logger = {
	error(message: string, branch?: string) {
		print(`[${timestamp()}][ERROR]${branch ? "["+branch+"]" : ""} ${message}`);
	},
	warn(message: string, branch?: string) {
		print(`[${timestamp()}][WARN]${branch ? "["+branch+"]" : ""} ${message}`);
	},
	info(message: string, branch?: string) {
		print(`[${timestamp()}][INFO]${branch ? "["+branch+"]" : ""} ${message}`);
	},
	log(message: string, branch?: string) {
		print(`[${timestamp()}]${branch ? "["+branch+"]" : ""} ${message}`);
	},
};
export default logger;