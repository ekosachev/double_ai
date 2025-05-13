import { getRequest, postRequest } from "./request.js";

export const getDialogue = () => getRequest('/dialogue/');
export const getDialogueById = (id) => getRequest(`/dialogue/${id}/`);
export const createDialogue = (data) => postRequest('/dialogue/create/', data);

export const getBranch = () => getRequest('/branch/');
export const getBranchById = (id) => getRequest(`/branch/${id}/`);
export const createBranch = (data) => postRequest('/branch/create/', data);

export const getMessages = (branchId) => getRequest(`/branch/${branchId}/messages/`);
export const createMessage = (data) => postRequest('/message/create/', {
    ...data,
    timestamp: new Date().toISOString()
});