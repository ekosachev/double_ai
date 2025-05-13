import { getRequest } from "./request.js";

export const getDialogue = () => getRequest('/dialogue/');
export const getDialogueById = (id) => getRequest(`/dialogue/${id}/`);

export const getBranch = () => getRequest('/branch/');
export const getBranchById = (id) => getRequest(`/branch/${id}/`);

export const getMessages = (branchId) => getRequest(`/branch/${branchId}/messages/`);