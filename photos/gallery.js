//check if ios
var iphone = document.getElementsByTagName("body")[0].dataset.ios === "true";

//make the elements go fullscreen on click
let thumbnails = document.querySelectorAll(".thumbnail");
thumbnails.forEach(element => {
    var image = element.querySelector(".thumbnail-image");
    var title = element.querySelector(".thumbnail-title");
    var titleContent = title.innerHTML;
    var galleryFolderPath = image.getAttribute("src").substring(0, image.getAttribute("src").indexOf("/") + 1);
    var size = parseInt(image.dataset.size);
    var fileName = image.dataset.filename;

    //add click event to each thumbnail
    element.addEventListener("click", (event) => { 
        if (!iphone) {
            element.requestFullscreen();
        } else {
            if (document.querySelector(".fullscreen-element") === null) {
                element.dispatchEvent(new CustomEvent("iPhoneRequestFullscreen"));
            }
        } 
    });

    //add fullscreen change event listeners
    if (!iphone) {
        element.addEventListener("fullscreenchange", handleFullscreenChange);
    } else {
        element.addEventListener("iPhoneRequestFullscreen", handleIPhoneRequestFullscreen);
        element.addEventListener("iPhoneExitFullscreen", handleIPhoneExitFullscreen);

        function handleIPhoneExitFullscreen() {
            //exiting iphone fullscreen
            console.log("exiting");
            element.classList.remove("fullscreen-element");
            element.classList.remove("iphone-fullscreen-element");
            element.innerHTML = `
                <img src="` + galleryFolderPath + `thumbnail.jpeg" class="thumbnail-image" data-size="` + size + `" data-filename="` + fileName + `">
                <h2 class="thumbnail-title">` + titleContent + `</h2>
            `;
            element.style.cursor = "pointer";
        }

        function handleIPhoneRequestFullscreen() {
            //entering iphone fullscreen
            console.log("entering");

            window.addEventListener("keydown", arrowKeyPressed);

            element.classList.add("fullscreen-element");
            element.classList.add("iphone-fullscreen-element");
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

            //make the arrows trigger manual keydown
            var nextArrow = document.querySelector("#gallery-next-button");
            var pressRightArrow = new Event("keydown");
            pressRightArrow.key = "ArrowRight";
            nextArrow.addEventListener("click", (event) => { window.dispatchEvent(pressRightArrow); });

            var backArrow = document.querySelector("#gallery-back-button");
            var pressLeftArrow = new Event("keydown");
            pressLeftArrow.key = "ArrowLeft";
            backArrow.addEventListener("click", (event) => { window.dispatchEvent(pressLeftArrow); });
            
            backArrow.style.opacity = "0%";
            backArrow.style.cursor = "default";

            //make return arrow exit fullscreen
            var returnArrow = document.querySelector("#gallery-return-button");
            returnArrow.addEventListener("click", (event) => { 
                event.stopPropagation(); 
                element.dispatchEvent(new CustomEvent("iPhoneExitFullscreen"));
            });

            //idling
            window.addEventListener('touchstart', resetIdleTimer);

            resetIdleTimer();
        }

    }
    
    //event handlers

    //fullscreenchange-no iphone
    function handleFullscreenChange(customFullscreenElement) {
        
        if (document.fullscreenElement === null) {
            //exiting fullscreen------------------
            element.classList.remove("fullscreen-element");
            element.innerHTML = `
                <img src="` + galleryFolderPath + `thumbnail.jpeg" class="thumbnail-image" data-size="` + size + `" data-filename="` + fileName + `">
                <h2 class="thumbnail-title">` + titleContent + `</h2>
            `;
            element.style.cursor = "pointer";
        } else {
            //entering fullscreen--------------
            element.classList.add("fullscreen-element");
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

            //make the arrows trigger manual keydown
            var nextArrow = document.querySelector("#gallery-next-button");
            var pressRightArrow = new Event("keydown");
            pressRightArrow.key = "ArrowRight";
            nextArrow.addEventListener("click", (event) => { window.dispatchEvent(pressRightArrow); });

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

            resetIdleTimer();
        }
    }

    function arrowKeyPressed(e) {   
        if (document.querySelector(".fullscreened-image") === null) return;
        if (e.key != "ArrowRight" && e.key != "ArrowLeft") return;

        var fullscreenedImage = document.querySelector(".fullscreened-image");

        var currentImageIndex = parseInt(fullscreenedImage.getAttribute("src").substring(galleryFolderPath.length, fullscreenedImage.getAttribute("src").indexOf(fileName)));
        if (e.key == "ArrowRight") {
            if (currentImageIndex < size) {
                //can go right
                fullscreenedImage.setAttribute("src", galleryFolderPath + (currentImageIndex + 1).toString() + fileName);
            }
        }
        if (e.key == "ArrowLeft") {
            if (currentImageIndex > 1) {
                //can go left
                fullscreenedImage.setAttribute("src", galleryFolderPath + (currentImageIndex - 1).toString() + fileName);
            }
        }
        currentImageIndex = parseInt(fullscreenedImage.getAttribute("src").substring(galleryFolderPath.length, fullscreenedImage.getAttribute("src").indexOf(fileName)));

        var fullscreenedTitleContent = document.querySelector(".fullscreened-title").innerHTML.substring(0, document.querySelector(".fullscreened-title").innerHTML.indexOf("("));

        document.querySelector(".fullscreened-title").innerHTML = fullscreenedTitleContent + "(" + currentImageIndex + "/" + size + ")";

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
});

var idleTimer;

function resetIdleTimer() {
    
    var controlContainer = document.querySelector(".gallery-control-container");
    var element = document.querySelector(".fullscreen-element");
    if (element === null) return;

    element.style.cursor = "default";
    controlContainer.classList.remove('idle');

    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
        //reset fullscreen element variables
        if (document.querySelector(".fullscreen-element") === null) return;
        controlContainer = document.querySelector(".gallery-control-container");
        element = document.querySelector(".fullscreen-element");


        controlContainer.classList.add('idle');
        element.style.cursor = "none";
    }, 3000);
}