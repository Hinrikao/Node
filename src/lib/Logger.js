const colors = require("colors");
const { DateTime } = require("luxon");
const config = require("@src/config.js");

class Logger {
	constructor() {
		// date time string
		this.dt = () =>
			colors.gray(DateTime.now().toFormat(config.timeFormat ?? "dd/MM/yyyy h:mm:ss a"));

		// get log origin
		this.origin = this.getOrigin().split(/[\\/]/).pop();
	}

	/**
	 * Meant to be used only in the constructor
	 * @description Get the origin of the log
	 * @returns {string} - the origin of the log
	 */
	getOrigin() {
		let filename = "";
		let pst = Error.prepareStackTrace;
		Error.prepareStackTrace = (err, stack) => {
			return stack;
		};

		try {
			let err = new Error();
			let callerfile;
			let currentfile;
			currentfile = err.stack.shift().getFileName();

			while (err.stack.length) {
				callerfile = err.stack.shift().getFileName();

				if (currentfile !== callerfile) {
					filename = callerfile;
					break;
				}
			}
		} catch (error) {
			this.error(error);
		}

		Error.prepareStackTrace = pst;
		return filename;
	}

	/**
	 * For logging information type messages
	 * @param {String} content - can be modified with colors
	 * @returns {void}
	 */
	info(content) {
		const output =
			this.dt() +
			" |" +
			`  ✉️   [` +
			colors.yellow(
				`${this.origin.length > 20 ? this.origin.substring(0, 17) + "..." : this.origin}`,
			) +
			" ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
			`] ` +
			`[${colors.cyan("INFO")}] ` +
			content;

		console.log(output);
	}

	/**
	 * For logging warning type messages
	 * @param {string} content - defaults to yellow but can be modified with colors
	 * @returns {void}
	 */
	warn(content) {
		const output =
			this.dt() +
			" |" +
			`  ⚠️   [` +
			colors.yellow(
				`${this.origin.length > 20 ? this.origin.substring(0, 17) + "..." : this.origin}`,
			) +
			" ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
			`] ` +
			`[${colors.yellow("WARNING")}] ` +
			`${colors.yellow(content)}`;

		console.log(output);
	}

	/**
	 * For logging error type messages
	 * @param {Error|string} content - defaults to red but can be modified with colors
	 * @return {void}
	 */
	async error(content) {
		const error = content.stack ? content.stack : content;
		const output =
			this.dt() +
			" |" +
			`  🔴  [` +
			colors.yellow(
				this.origin.length > 20 ? this.origin.substring(0, 17) + "..." : this.origin,
			) +
			" ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
			`] ` +
			`[${colors.red("ERROR")}] ` +
			colors.red(error);

		console.log(output);
	}

	/**
	 * For logging debug type messages
	 * @param {string} content - defaults to green but can be modified with colors
	 * @return {void}
	 */
	debug(content) {
		const output =
			this.dt() +
			" |" +
			`  🐛  [` +
			colors.yellow(
				`${this.origin.length > 20 ? this.origin.substring(0, 17) + "..." : this.origin}`,
			) +
			" ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
			`] ` +
			`[${colors.green("DEBUG")}] ` +
			colors.green(content);

		console.log(output);
	}

	/**
	 * For logging success type messages to test if the code is working as expected
	 * @param {string} content - Can be modified with colors
	 * @return {void}
	 */
	success(content) {
		const output =
			this.dt() +
			" |" +
			`  ✅  [` +
			colors.yellow(
				`${this.origin.length > 20 ? this.origin.substring(0, 17) + "..." : this.origin}`,
			) +
			" ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
			`] ` +
			`[${colors.green("SUCCESS")}] ` +
			content;

		console.log(output);
	}

	/**
	 * @typedef {Object} options - type and color of the message
	 * @property {string} emoji
	 * @property {string} type - type of the message defaults to "CUSTOM"
	 * @property {import("@types/functions").Color} color - color of the message defaults to "magenta"
	 */

	/**
	 * For logging messages which can't be classified into any of the above types
	 * @param {string} content - can be modified with colors
	 * @param {options} options - type and color of the message
	 * @return {void}
	 */
	custom(content, options) {
		if (!options || typeof options !== "object") options = {};

		const output =
			this.dt() +
			" |" +
			`  ${options.emoji ?? "💥"}  [` +
			colors.yellow(
				`${this.origin.length > 20 ? this.origin.substring(0, 17) + "..." : this.origin}`,
			) +
			" ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
			`] ` +
			`[${colors[options.color ?? "magenta"](options.type ?? "CUSTOM")}] ` +
			content;

		console.log(output);
	}
}

module.exports = { Logger };
