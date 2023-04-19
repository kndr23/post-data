const API_URL = "https://jsonplaceholder.typicode.com/posts";

const form = document.getElementById("form");
const postsWrapper = document.getElementById("posts");
const popUpButton = document.getElementById("pop-up-button");
const loader = document.getElementById("loader-wrapper");

const onSetPopUpData = (title, description) => {
  const popUp = document.getElementById("pop-up");
  const popUpTitle = document.getElementById("pop-up-title");
  const popUpDescription = document.getElementById("pop-up-description");

  popUp.style.display = "block";
  popUpTitle.innerText = title;
  popUpDescription.innerText = description;
};

const onClosePopUp = () => {
  const popUp = document.getElementById("pop-up");
  popUp.style.display = "none";
};

const onSetLoader = () => {
  loader.style.display = "block";
};

const onCloseLoader = () => {
  loader.style.display = "none";
};

const postData = async (data) => {
  const params = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  };

  try {
    onSetLoader();
    const response = await fetch(API_URL, params);

    if (!response.ok) {
      throw new Error("Something goes wrong!");
    }

    const { title, body } = await response.json();
    onSetPopUpData(title, body);
  } catch (error) {
    onSetPopUpData("Error!", error);
  } finally {
    onCloseLoader();
  }
};

const fetchData = async (id) => {
  try {
    onSetLoader();
    const response = await fetch(API_URL + (id ? `/${id}` : ""));

    if (!response.ok) {
      throw new Error("Something goes wrong!");
    }

    const data = await response.json();

    id ? onSetPopUpData(data.title, data.body) : renderPosts(data);
  } catch (error) {
    onSetPopUpData("Error!", error);
  } finally {
    onCloseLoader();
  }
};

// const fetchSinglePost = async (id) => {
//   try {
//     onSetLoader();
//     const response = await fetch(API_URL + "/" + id);

//     if (!response.ok) {
//       throw new Error("Something goes wrong!");
//     }

//     const { title, body } = await response.json();
//     onSetPopUpData(title, body);
//   } catch (error) {
//     onSetPopUpData("Error!", error);
//   } finally {
//     onCloseLoader();
//   }
// };

const renderPosts = (posts) => {
  postsWrapper.innerHTML = "";

  posts.map(({ title, id }) => {
    const postDiv = document.createElement("div");
    postDiv.setAttribute("id", id);

    const postTitle = document.createElement("h3");
    postTitle.textContent = title;
    postTitle.classList.add("title");

    postDiv.appendChild(postTitle);
    postDiv.addEventListener("click", () => fetchData(id));
    postsWrapper.appendChild(postDiv);
  });
};

popUpButton.addEventListener("click", onClosePopUp);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const errorText = document.getElementById("error");

  if (!title || !body) {
    errorText.innerText = "You do not enter title or description of the post!";
    return;
  }

  const data = {
    userId: 1,
    title,
    body,
  };

  postData(data);
});

window.addEventListener("load", () => {
  fetchData();
});
