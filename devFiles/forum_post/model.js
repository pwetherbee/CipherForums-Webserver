export const state = {
  id: "",
  key: "",
  author: "",
  comments: [],
};

const updateState = function (data) {
  state.id = data.id;
  console.log("this forum ID is:", data.id);
  state.author = data.author;
  state.comments = data.comments;
  state.title = data.title;
  console.log(state.data);
  state.date = data.date;
};

const endpoint = "https://cipherforums.com";
// const endpoint = "http://localhost:3000";
//http://localhost:3000/
//http://node-express-dev2.us-east-2.elasticbeanstalk.com/
export const getForum = async function (id, url = `${endpoint}/api/threads`) {
  console.log("fetching data");
  const res = await fetch(`${url}/${id}`);
  // console.log("heres the res", res);
  if (!res.ok) {
    throw new Error("ID not found");
  }
  // console.log("heres the res", res);
  const data = await res.json();
  console.log("data converted to JSON");
  // console.log("heres the data", data);
  updateState(data);
  return data;
};

export const postComment = async function (
  comment,
  url = `${endpoint}/api/threads/${state.id}`
) {
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
  // const res = await Promise.race([fetchPro, timeout(1000)]);
  // if (!res.ok) {

  // }
  // const res = await Promise.race([fetchPro]);
};

//
// let url = "http://node-express-dev2.us-east-2.elasticbeanstalk.com/";
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
