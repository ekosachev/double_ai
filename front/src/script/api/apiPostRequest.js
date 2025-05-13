import { postRequest } from "./request.js";

export const createDialogue = (data) => postRequest('/dialogue/create', data);
export const createBranch = (data) => postRequest('/branch/create', data);
export const createMessage = (data) => postRequest('/message/create', data);