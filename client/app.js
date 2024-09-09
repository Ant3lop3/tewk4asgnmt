//! for GET requests from db
const scrollContainer = document.getElementById("scrollCont");

//! now we fetch the db data from the server (which in turn the server gets from the db)
async function getMedievalScroll() {
    const response = await fetch ("http://localhost:8080/medievalscroll"); //<<change URL on deployment
    const data = await response.json();
    console.log(data);

    // empty the container for new entries, prevent duplication:
    scrollContainer.innerHTML = "";

    //! WITHIN THIS getMedievalscroll function- we show the db data on the page
    //! we use forEach to loop through each message to then put on the page
    data.forEach((medievalscroll) => {
        const messageDiv = document.createElement("div")
        messageDiv.className = "likes-container";


        const p = document.createElement("p");
        p.textContent = `I, ${medievalscroll.speaker} ${medievalscroll.title}, town of ${medievalscroll.town}, thee steads name of ${medievalscroll.stead}, make known that which must be heard...`;
        p.classList.add("introTxt");
        scrollContainer.appendChild(p)
        
        const messageOutput = document.createElement("messageOutput");
        messageOutput.textContent = `${medievalscroll.message}`;
        messageOutput.classList.add("messageOutput"); //allows you to add a class tag- ref this in the css to edit
        scrollContainer.appendChild(messageOutput)
//! making the like/dislike buttons:
        const likeButton = document.createElement("button")
        likeButton.textContent = `Favour ${medievalscroll.likes}`;
        likeButton.classList.add("likeButton");
        likeButton.addEventListener("click", () => handleLike(medievalscroll.id));
        messageDiv.appendChild(likeButton);

        const dislikeButton = document.createElement("button");
        dislikeButton.textContent = `Displeasure (${medievalscroll.dislikes || 0})`; // || -means OR, returns TRUE if one of the 2...
        //statements is truthy. if they are both falsy then returns FALSE
        dislikeButton.classList.add("dislikeButton")
        dislikeButton.addEventListener("click", () => handleDislike(medievalscroll.id));
        messageDiv.appendChild(dislikeButton);

        scrollContainer.appendChild(messageDiv);

    });
}

async function handleLike(messageId) {
    await fetch(`http://localhost:8080/medievalscroll/${messageId}/like`, {
        method: 'POST'
    });
    getMedievalScroll(); // Refresh the messages to show updated like count
}

async function handleDislike(messageId) {
    await fetch(`http://localhost:8080/medievalscroll/${messageId}/dislike`, {
        method: 'POST'
    });
    getMedievalScroll(); // Refresh the messages to show updated dislike count
}

getMedievalScroll();

//! for POST requests

const form = document.getElementById("messagingForm");

async function handlePostMessages(event) {
    event.preventDefault();

    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    console.log(data)
    await fetch("http://localhost:8080/medievalscroll", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    //! below resets only the message field (saves users having to put in their name and title everytime)
    const messageInput = form.querySelector('#messageInput');
    if (messageInput) {
        messageInput.value = '';
}
    getMedievalScroll();
}


form.addEventListener("submit", handlePostMessages)