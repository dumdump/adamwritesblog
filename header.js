var homePath = "file:///Users/adampeng/Documents/coding/adamwritesblog/";

let headerElement = document.querySelector("#header-container");
headerElement.innerHTML = `
    <div id="logo-container">
        <img id="logo-picture" src="` + homePath + `logopicture.jpg" height="75px" width="75px" onclick="window.open('https://www.instagram.com/adamtakesphoto?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', '_blank')">
    </div>
    <div id="navbar-container">
        <a href="` + homePath + `index.html" class="navbar-link">home</a>
        <span class="navbar-divider">&middot;</span>
        <a href="` + homePath + `blog/index.html" class="navbar-link">blog</a>
        <span class="navbar-divider">&middot;</span>
        <a href="` + homePath + `photos/index.html" class="navbar-link">photos</a>
        <span class="navbar-divider">&middot;</span>
        <a href="` + homePath + `about/index.html" class="navbar-link">about</a>
    </div>`;