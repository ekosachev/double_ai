import {getRequest, postRequest} from "request.js";

function getPermission() {
    return getRequest('/permission');
}

function getDialogueById(id) {
    return getRequest('/permission' + id);
}

function createDialogue() {
    return postRequest('/permission/create')
}