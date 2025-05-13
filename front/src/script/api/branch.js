import {getRequest, postRequest} from "request.js";

function getBranch() {
    return getRequest('/branch')
}

function getBranchById(id) {
    return getRequest('/branch' + id)
}

function getMessages(id) {
    return getRequest('/branch/' + id + '/messages');
}

function createBranch() {
    return postRequest('/branch/create');
}