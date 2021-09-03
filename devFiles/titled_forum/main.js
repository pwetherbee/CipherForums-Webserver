"use strict";

import { AJAX } from "../helpers/ajaxReq";
import { API_URL } from "../helpers/config";

const controlFormSubmit = function () {
  // Grab information from fields

  // make ajax post request to web server
  const data = {
    title: "",
    subtitle: "",
    keyID: "",
  };
  const res = AJAX(`${API_URL}/create/forum`);
};
