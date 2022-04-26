import fs from "fs";
import path from "path";
import { getBody, getDB, sendResponse, shieldApi } from "./utils.js";

/**
 * Update Candidate request hanlder
 * @param {*} req
 * @param {*} res
 */
const updateCandidate = async (req, res) => {
  try {

    if (req.params["health"] === "health") {
      return sendResponse(res, 200, {
        success: true,
        msg: "Health check success",
      });
    }

    const DB_FILE = path.resolve("../localdb.json");
    const localDBData = getDB(DB_FILE);
    const { id, ...updateData } = await getBody(req);

    const index = localDBData.findIndex((obj) => {
      return obj.id == id;
    });

    if (index !== -1) {
      localDBData[index] = {
        ...localDBData[index],
        ...updateData,
      };

      fs.writeFileSync(DB_FILE, JSON.stringify(localDBData));
      sendResponse(res, 200, { status: true, msg: "success" });
    } else {
      sendResponse(res, 400, { status: false, msg: "Cadidate not found" });
    }
  } catch (e) {
    sendResponse(res, 500, { status: false, msg: e.message, err: e });
  }
};

export default updateCandidate;
