//make the elements go fullscreen on click
let thumbnails = document.querySelectorAll(".thumbnail");
thumbnails.forEach(element => {
    var image = element.querySelector(".thumbnail-image");
    var title = element.querySelector(".thumbnail-title");
    var titleContent = title.innerHTML;
    var galleryFolderPath = image.getAttribute("src").substring(0, image.getAttribute("src").indexOf("/") + 1);
    var size = parseInt(image.dataset.size);
    var fileName = image.dataset.filename;

    element.addEventListener("click", (event) => { element.requestFullscreen(); });

    element.addEventListener("fullscreenchange", (event) => {
        if (document.fullscreenElement === null) {
            //exiting fullscreen------------------
            element.innerHTML = `
                <img src="` + galleryFolderPath + `thumbnail.jpeg" class="thumbnail-image" data-size="` + size + `" data-filename="` + fileName + `">
                <h2 class="thumbnail-title">` + titleContent + `</h2>
            `;
            element.style.cursor = "pointer";
        } else {
            //entering fullscreen--------------
            window.addEventListener("keydown", arrowKeyPressed);
            element.innerHTML = `
                <img src="` + galleryFolderPath + `1` + fileName + `" class="fullscreened-image" data-size="` + size + `" data-filename="` + fileName + `">
                <div class="gallery-control-container">
                    <div class="gallery-control-container-upper">
                        <span class="gallery-button" id="gallery-back-button">&#8678;</span>
                        <span class="fullscreened-title">` + titleContent + ` (1/` + size + `)</span>
                        <span class="gallery-button" id="gallery-next-button">&#8680;</span>
                    </div>
                    <div class="gallery-control-container-lower">
                        <span class="gallery-button" id="gallery-return-button">&#8617;</span>
                    </div>
                </div>
            `;
            title.setAttribute("class", "fullscreened-title");

            //make the arrows trigger manual keydown
            var nextArrow = document.querySelector("#gallery-next-button");
            var pressRightArrow = new Event("keydown");
            pressRightArrow.key = "ArrowRight";
            nextArrow.addEventListener("click",(event) => { window.dispatchEvent(pressRightArrow); });

            var backArrow = document.querySelector("#gallery-back-button");
            var pressLeftArrow = new Event("keydown");
            pressLeftArrow.key = "ArrowLeft";
            backArrow.addEventListener("click", (event) => { window.dispatchEvent(pressLeftArrow); });
            backArrow.style.opacity = "0%";
            backArrow.style.cursor = "default";

            //make return arrow trigger escape keydown
            var returnArrow = document.querySelector("#gallery-return-button");
            returnArrow.addEventListener("click", (event) => { document.exitFullscreen(); });

            //idling

            window.addEventListener('mousemove', resetIdleTimer);
            window.addEventListener('keydown', resetIdleTimer);
            window.addEventListener('touchstart', resetIdleTimer);

            resetIdleTimer();
        }
    });
});

function arrowKeyPressed(e) {   
    var image = document.querySelector(".fullscreened-image");

    if (image === null) return;
    if (e.key != "ArrowRight" && e.key != "ArrowLeft") return;

    var galleryFolderPath = image.getAttribute("src").substring(0, image.getAttribute("src").indexOf("/") + 1);
    var size = parseInt(image.dataset.size);
    var fileName = image.dataset.filename;
    var currentImageIndex = parseInt(image.getAttribute("src").substring(galleryFolderPath.length, image.getAttribute("src").indexOf(".jpeg")));
    if (e.key == "ArrowRight") {
        if (currentImageIndex < size) {
            //can go right
            image.setAttribute("src", galleryFolderPath + (currentImageIndex + 1).toString() + fileName);
        }
    }
    if (e.key == "ArrowLeft") {
        if (currentImageIndex > 1) {
            //can go left
            image.setAttribute("src", galleryFolderPath + (currentImageIndex - 1).toString() + fileName);
        }
    }
    currentImageIndex = parseInt(image.getAttribute("src").substring(galleryFolderPath.length, image.getAttribute("src").indexOf(fileName)));

    var title = document.querySelector(".fullscreened-title").innerHTML.substring(0, document.querySelector(".fullscreened-title").innerHTML.indexOf("("));

    document.querySelector(".fullscreened-title").innerHTML = title + "(" + currentImageIndex + "/" + size + ")";

    //get rid of arrows if on ends
    if (currentImageIndex == 1) {
        document.querySelector("#gallery-back-button").style.opacity = "0%";
        document.querySelector("#gallery-back-button").style.cursor = "default";
    } else {
        document.querySelector("#gallery-back-button").style.opacity = "100%";
        document.querySelector("#gallery-back-button").style.cursor = "pointer";
    }

    if (currentImageIndex == size) {
        document.querySelector("#gallery-next-button").style.opacity = "0%";
        document.querySelector("#gallery-next-button").style.cursor = "default";
    } else {
        document.querySelector("#gallery-next-button").style.opacity = "100%";
        document.querySelector("#gallery-next-button").style.cursor = "pointer";
    }
}

var idleTimer;

function resetIdleTimer() {
    
    var controlContainer = document.querySelector(".gallery-control-container");
    var element = document.fullscreenElement;
    if (document.fullscreenElement === null) return;

    element.style.cursor = "default";
    controlContainer.classList.remove('idle');

    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
        if (document.fullscreenElement === null) return;
        controlContainer.classList.add('idle');
        element.style.cursor = "none";
    }, 3000);
}