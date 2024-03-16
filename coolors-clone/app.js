// selections
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexCodes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustBtns = document.querySelectorAll(".adjust");
const lockBtns = document.querySelectorAll(".lock");
const closeAdjustmentBtns = document.querySelectorAll(".close-adjustment");
let initialColors; // to keep track of initialColors
let savedPalettes = []; // for localStorage

// event listeners
generateBtn.addEventListener('click', randomColors)

sliders.forEach((slider) => {
    slider.addEventListener("input", hslControls);
})

colorDivs.forEach((div, index) => { // because of event bubbling, any change in sliders will trigger this
    div.addEventListener("change", () => {
        updateTextUI(index);
    })
})

currentHexCodes.forEach((hex) => {
    hex.addEventListener('click', () => {
        copyToClipboard(hex);
    })
})

popup.addEventListener("transitionend", () => {
    popup.classList.remove("active");
    const popupBox = popup.children[0];
    popupBox.classList.remove("active");
})

adjustBtns.forEach((adjustBtn, index) => {
    adjustBtn.addEventListener('click', () => {
        adjustSliders(index);
    })
})

closeAdjustmentBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const slider = document.querySelectorAll(".sliders")[index];
        slider.classList.remove("active");
    })
})

lockBtns.forEach((btn, index) => {
    btn.querySelector("i").classList.add("fa-lock-open");

    btn.addEventListener('click', () => {
        colorDivs[index].classList.toggle("locked");
        changeLockIcon(btn, index);
    })
})

// functions

function generateHex() {
    const hexColor = chroma.random();
    return hexColor;
}

function randomColors() {
    initialColors = [];

    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

        // lock feature
        if(div.classList.contains("locked")) {
            initialColors.push(hexText.innerText);
            return;
        } else {
            initialColors.push(randomColor.hex());
        }

        // Add color to the bg
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        checkTextContrast(randomColor, hexText)

        // Initialize colourize sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation);
    })

    resetInputs();

    // check text contrast
    adjustBtns.forEach((btn, index) => {
        const lockBtn = lockBtns[index];

        checkTextContrast(initialColors[index], btn);
        checkTextContrast(initialColors[index], lockBtn);
    })
}

// if the bg-color is dark, then the text on top of it, should be light & vice versa
function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();

    if(luminance > 0.5) {
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}

function colorizeSliders(color, hue, brightness, saturation) {
    // Scale Hue - hue will always be the same for any colour
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`;

    // Scale brightness
    const midBright = color.set("hsl.l", 0.5);
    const scaleBright = chroma.scale(["black", midBright, "white"]);
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;

    // Scale saturation
    const noSat = color.set("hsl.s", 0);
    const fullSat = color.set("hsl.s", 1);

    const scaleSat = chroma.scale([noSat, color, fullSat]); // this is a fn
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
}

function hslControls(e) {
    const index = e.target.getAttribute("data-bright") || e.target.getAttribute("data-sat") || e.target.getAttribute("data-hue");
    const sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    // const bgColor = colorDivs[index].querySelector("h2").innerText;
    const bgColor = initialColors[index]; // we can go back to the initial colour

    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value);

    colorDivs[index].style.backgroundColor = color;

    // colorize the sliders on changing the colors
    colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUI(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);

    let textHex = activeDiv.querySelector("h2");
    let icons = activeDiv.querySelectorAll(".controls button");

    textHex.innerText = color.hex();

    // check text contrast
    checkTextContrast(color, textHex);

    for(let icon of icons) {
        checkTextContrast(color, icon);
    }
}

function resetInputs() {
    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach((slider) => {
        if(slider.name === "hue") {
            const color = initialColors[slider.getAttribute("data-hue")];
            const hueValue = chroma(color).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        if(slider.name === "brightness") {
            const color = initialColors[slider.getAttribute("data-bright")];
            const brightValue = chroma(color).hsl()[2];
            slider.value = Math.floor(brightValue * 100) / 100; // in decimals upto 2 places
        }
        if(slider.name === "saturation") {
            const color = initialColors[slider.getAttribute("data-sat")];
            const satValue = chroma(color).hsl()[1];
            slider.value = Math.floor(satValue * 100) / 100;
        }
    })
}

function copyToClipboard(hex) {
    // to actually copy to clipboard
    const element = document.createElement('textarea');
    element.value = hex.innerText;
    document.body.appendChild(element);
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);

    // popup animation
    popup.classList.add("active");
    const popupBox = popup.children[0];
    popupBox.classList.add("active");
}

function adjustSliders(index) {
    const slider = document.querySelectorAll(".sliders")[index];
    slider.classList.toggle("active");
}

function changeLockIcon(btn, index) {
    if(colorDivs[index].classList.contains("locked")) {
        console.log("inside lock");
        btn.querySelector("i").classList.remove("fa-lock-open");
        btn.querySelector("i").classList.add("fa-lock");
    } else {
        console.log("inside lock open");
        btn.querySelector("i").classList.remove("fa-lock");
        btn.querySelector("i").classList.add("fa-lock-open");
    }
}


// for saving colorPalettes (localStorage)
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

saveBtn.addEventListener('click', openPalette);
closeSave.addEventListener('click', closePalette);
submitSave.addEventListener('click', savedPalette);
libraryBtn.addEventListener('click', openLibrary);
closeLibraryBtn.addEventListener('click', closeLibrary);

function openPalette() {
    const popup = saveContainer.children[0]; // get popup
    popup.classList.add("active");
    saveContainer.classList.add("active");
}

function closePalette() {
    const popup = saveContainer.children[0]; // get popup
    popup.classList.remove("active");
    saveContainer.classList.remove("active");
}

function savedPalette() {
    const popup = saveContainer.children[0]; // get popup
    popup.classList.remove("active");
    saveContainer.classList.remove("active");

    const name = saveInput.value;
    const colors = [];

    currentHexCodes.forEach((color) => {
        colors.push(color.innerText);
    })

    const paletteNr = savedPalettes.length;
    const paletteObj = { name, colors, nr: paletteNr };
    savedPalettes.push(paletteObj);

    saveToLocalStorage(paletteObj);
    saveInput.value = "";

    // Add palette to library
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");

    const title = document.createElement("h4");
    title.innerText = paletteObj.name;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");
    paletteObj.colors.forEach((color) => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = color;
        preview.appendChild(smallDiv);
    })

    const paletteBtn = document.createElement("button");
    paletteBtn.classList.add("pick-palette-btn");
    paletteBtn.classList.add(paletteNr);
    paletteBtn.innerText = "Select";

    // add event to 'select' btn
    paletteBtn.addEventListener('click', (e) => {
        closeLibrary();

        initialColors = [];
        const paletteIndex = e.target.classList[1];
        savedPalettes[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color);
            colorDivs[index].style.backgroundColor = color;

            const hexText = colorDivs[index].children[0];
            checkTextContrast(color, hexText);
            updateTextUI(index);
        });
        resetInputs();
    });

    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);

    libraryContainer.children[0].appendChild(palette);
}

function saveToLocalStorage(palette) {
    let palettes;
    if(localStorage.getItem("palettes") !== null) {
        palettes = JSON.parse(localStorage.getItem("palettes"));
    } else {
        palettes = [];
    }

    palettes.push(palette);
    localStorage.setItem("palettes", JSON.stringify(palettes));
}

function openLibrary() {
    libraryContainer.classList.add("active");
    const popup = document.querySelector(".library-popup");
    popup.classList.add("active");
}

function closeLibrary() {
    libraryContainer.classList.remove("active");
    const popup = document.querySelector(".library-popup");
    popup.classList.remove("active");
}

randomColors();



// Documentation for Chroma - https://gka.github.io/chroma.js/