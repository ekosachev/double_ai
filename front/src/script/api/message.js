import {getRequest, postRequest} from "request.js";

function getMessages() {
    return getRequest('/messages');
}

function getMessagesById(id) {
    return getRequest('/messages/' + id);
}

function getFullMessagesContext(id) {
    return getRequest('/messages/' + id + '/context');
}

function createMessage() {
    return postRequest('/messages/create');
}