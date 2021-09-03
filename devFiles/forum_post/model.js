import { API_URL } from "../helpers/config";
export const state = {
  id: "",
  key: "",
  author: "",
  comments: [],
};
// Updates current page state based on forum ID
const updateState = function (data) {
  state.id = data.id;
  state.author = data.author;
  state.comments = data.comments;
  state.title = data.title;
  state.date = data.date;
  state.subtitle = data.subtitle;
};

// Grab correct url from config file in helpers
const endpoint = API_URL;

export const getForum = async function (id, url = `${endpoint}/api/threads`) {
  const res = await fetch(`${url}/${id}`);
  // console.log("heres the res", res);
  if (!res.ok) {
    throw new Error("ID not found");
  }
  const data = await res.json();
  updateState(data);
  return data;
};

// Make an AJAX request to the web server to post a comment to the current thread
export const postComment = async function (
  comment,
  url = `${endpoint}/api/threads/${state.id}`
) {
  console.log("the url is:", url);
  const fetchPro = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });
  if (!fetchPro.ok) {
    alert("comment could not be submitted");
    return;
  }
  state.comments.push(comment);
};

// Make an AJAX request to the web server to create a new thread
export const putForum = async function (
  comment,
  url = `${endpoint}/api/threads`
) {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!res?.ok) {
    alert("Post could not be created");
    return;
  }
  const data = res.json();
  updateState(data);
  console.log(data);
  return data;
};
