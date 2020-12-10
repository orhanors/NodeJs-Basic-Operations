const { writeJSON, readJSON } = require("fs-extra");

const readDB = async (filePath) => {
	try {
		const data = await readJSON(filePath);
		return data;
	} catch (err) {
		throw new Error(err);
	}
};

const writeDB = async (filePath, data) => {
	try {
		await writeJSON(filePath, data);
	} catch (err) {
		throw new Error(err);
	}
};

module.exports = { readDB, writeDB };
