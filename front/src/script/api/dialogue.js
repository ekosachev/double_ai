import {getRequest, postRequest} from "request.js";

function getDialogue() {
    return getRequest('/dialogue')
}

function getDialogueById(id) {
    return getRequest('/dialogue/' + id)
}

function createDialogue() {
    return postRequest('/dialogue/create')
}