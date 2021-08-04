export const state = {
  id: "",
  key: "",
  author: "",
  comments: [],
};

export const getForum = async function (
  id,
  url = "http://localhost:3000/api/threads"
) {
  const res = await fetch(`${url}/${id}`);
  if (!res.ok) {
    throw new Error("ID not found");
  }
  const data = await res.json();
  state.id = id;
  state.author = data.author;
  state.comments = data.comments;
  return data;
};

export const postComment = async function (
  comment,
  url = `http://localhost:3000/api/threads/${state.id}`
) {
  console.log(JSON.stringify({ foo: "bar" }));
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
