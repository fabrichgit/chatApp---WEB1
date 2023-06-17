(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let username;
    let room;

    const btn_log = document.getElementById("form-login");


    var counting = 0;


    btn_log.addEventListener("submit", function (e) {
        e.preventDefault();


        username = app.querySelector(".join-screen #pseudo").value;
        room = app.querySelector(".join-screen #room").value;

        if (username.trim() != "" || room.trim() != "") {

            app.querySelector(".join-screen").classList.add("active");
            app.querySelector(".chat-screen").classList.remove("active");

            socket.emit("newuser", {
                pseudo: username,
                receiver: room
            });

        } else {
            alert("Veuillez remplir orrectement tout les champs")
        }

    });


    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0) {
            return;
        }

        renderMessage("text", "my", {
            pseudo: username,
            text: message
        });

        socket.emit("chat", {
            pseudo: username,
            text: message,
            receiver: room
        });

        app.querySelector(".chat-screen #message-input").value = "";

    });

    app.querySelector(".chat-screen #darkLight").addEventListener("click", () => {
        toogle_Light_Dark();
    });



    app.querySelector(".chat-screen label").addEventListener("click", () => {
        let imgSelector = document.getElementById("image-input");

        imgSelector.onchange = () => {
            let reader = new FileReader();
            reader.readAsDataURL(imgSelector.files[0]);

            reader.addEventListener("load", () => {
                let source = reader.result;
                let imgUploaded = `
                <div class="content-message myImage">
                    <div class="name-img bgc-ownMp">
                        <div class="name">You</div>
                        <a href="${source}" title="watch it">
                            <img src="${source}" />
                        </a>
                        <div class="name">${getTimeStamp()}</div>
                    </div>
                </div>`;
                let imgRending = `
                <div class="content-message otherImage">
                    <div class="name-img bgc-otherMp">
                        <div class="name">${username}</div>
                        <a href="${source}" title="watch it">
                            <img src="${source}" />
                        </a>
                        <div class="name">${getTimeStamp()}</div>
                    </div>
                </div>
                `
                renderMessage("image", "my", imgUploaded);

                socket.emit("upload-img", {
                    pseudo: username,
                    content: imgRending,
                    receiver: room
                });
            })

        }
    })


    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", {
            pseudo: username,
            receiver: room
        });
        window.location.href = window.location.href;
    });

    socket.on("update", function (update) {
        if (update.receiver != room) {
            return;
        } else {
            renderMessage("text", "update", update.text);
            return;
        }
    })

    socket.on("add-online", function (name) {
        if (name.receiver != room) {
            return;
        } else {
            let el = document.createElement("div");
            let listOnline = document.querySelector(".block1");

            el.innerText = name.user;

            listOnline.appendChild(el);
            el.setAttribute("id", name.user);

            el.classList.add("userComing");

            return;
        }
    })

    socket.on("chat", function (message) {
        if (message.receiver != room) {
            return;
        } else {
            renderMessage("text", "other", message);
        }
    })

    socket.on("upload-img", (data) => {
        if (data.receiver != room) {
            return;
        } else {
            renderMessage("image", "other", data.content);
        }
    })


    socket.on("offline", (data) => {
        if (data.receiver != room) {
            return;
        } else {
            document.getElementById(data.user).style.display = "none";
        }
    })

    function renderMessage(type, owner, content) {
        let messageContainer = app.querySelector(".chat-screen .block2");
        if (type == "text" && owner == "my") {
            messageContainer.innerHTML += `
            <div class="content-message flex-end smsComing">
                <div class="forText bgc-ownMp">
                    <div class="name">You</div>
                    <div class="text">${content.text}</div>
                    <div class="name">${getTimeStamp()}</div>
                </div>
            </div>
            `;

        } else if (type == "text" && owner == "other") {
            messageContainer.innerHTML += `
            <div class="content-message flex-start smsComing">
                <div class="forText bgc-otherMp">
                    <div class="name">${content.pseudo}</div>
                    <div class="text">${content.text}</div>
                    <div class="name">${getTimeStamp()}</div>
                </div>
            </div>
            `;

        } else if (owner == "update") {
            messageContainer.innerHTML += `
            <div class="update">${content}</div>`;

        } else if (type == "image" && owner == "my") {
            messageContainer.innerHTML += content;
        } else if (type == "image" && owner == "other") {
            messageContainer.innerHTML += content;
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }


    function getTimeStamp() {
        let date = new Date();

        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`
    }


    function toogle_Light_Dark() {

        document.getElementById("wallpaper").classList.toggle("negative");
        document.getElementById("user-input").classList.toggle("negative");


        if (counting % 2 == 0) {
            document.getElementById("dark-light").setAttribute("src", "./img/8665313_cloud_sun_icon.png");
        } else {
            document.getElementById("dark-light").setAttribute("src", "./img/8541704_cloud_moon_icon.png");
        }

        counting++;
    }


})();