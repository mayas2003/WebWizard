// -------------------------------
// Global Variables & Initialization
// -------------------------------
let selectedElement = null;

// Initialize UI when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeUI);

// -------------------------------
// Event Listeners & UI Initialization
// -------------------------------
document.querySelector(".working-space").addEventListener("input", (event) => {
    if (event.target && event.target.isContentEditable) {
        updateHtmlCode(); 
    }
    updateCssCodeForRemovedElements();
});

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', event => {
        const tabId = event.target.getAttribute('data-tab');
        showPanel(tabId.replace('-btn', '')); // Derive panel ID from button
    });
});

// -------------------------------
// UI Functions
// -------------------------------
// Hide all panels and show the default one
function initializeUI() {
    document.querySelectorAll('.tab-panel').forEach(panel => panel.style.display = 'none');
    showPanel('general-tab'); // Default panel to show
}

// Show selected tab panel
function showPanel(panelId) {
    document.querySelectorAll('.tab-panel').forEach(panel => panel.style.display = 'none');
    document.getElementById(panelId).style.display = 'block';
}

// -------------------------------
// HTML & CSS Code Updaters
// -------------------------------
function updateHtmlCode() {
    const workingSpaceContent = document.querySelector(".working-space").innerHTML.trim();
    const parser = new DOMParser();
    const doc = parser.parseFromString(workingSpaceContent, "text/html");

    // Remove inline styles from elements
    doc.querySelectorAll("*").forEach(el => el.removeAttribute("style"));

    document.querySelector("#html-code pre").textContent = doc.body.innerHTML.trim();

    if (selectedElement) {
        updateCssCode(selectedElement);
    }
}

function updateCssCode(element) {
    if (element && element.id) {
        let cssCode = `#${element.id} {\n`;

        // Collect inline styles dynamically
        for (let i = 0; i < element.style.length; i++) {
            const property = element.style[i];
            const value = element.style.getPropertyValue(property);
            if (value) {
                cssCode += `    ${property}: ${value};\n`;
            }
        }
        cssCode += "}\n";

        const cssBlock = document.querySelector("#css-code pre");
        const currentCss = cssBlock.textContent.trim();

        const regex = new RegExp(`#${element.id} \\{[\\s\\S]*?\\}`, "g");
        cssBlock.textContent = regex.test(currentCss) 
            ? currentCss.replace(regex, cssCode.trim()) // Replace existing CSS
            : `${currentCss}\n${cssCode}`.trim(); // Append new CSS
    }
}

// Remove CSS of deleted elements
function updateCssCodeForRemovedElements() {
    const workingSpace = document.querySelector(".working-space");
    const cssBlock = document.querySelector("#css-code pre");
    const currentCss = cssBlock.textContent.trim();
    let updatedCss = currentCss;

    // Identify and remove CSS for non-existing elements
    const regex = /#([a-zA-Z0-9-_]+) \{[\s\S]*?\}/g;
    let match;
    while ((match = regex.exec(currentCss)) !== null) {
        if (!workingSpace.querySelector(`#${match[1]}`)) {
            updatedCss = updatedCss.replace(match[0], "").trim();
        }
    }
    cssBlock.textContent = updatedCss;
}

// -------------------------------
// Element Creation & Management
// -------------------------------
function addElement(type) {
    const id = generateId(type);
    const newElement = document.createElement(type);
    newElement.id = id;
    newElement.className = "custom-element";
    newElement.innerText = `${type.charAt(0).toUpperCase() + type.slice(1)} Text`;

    document.querySelector(".working-space").appendChild(newElement);
    updateHtmlCode();
    updateCssCode(newElement);
}

// Generate unique ID for an element
function generateId(type) {
    return `${type}-${Date.now()}`;
}

// -------------------------------
// Paragraph Controls & Styling
// -------------------------------
const addParagraphBtn = document.getElementById("add-paragraph-btn");
const alignSelect = document.getElementById("align-select");
const fontFamilySelect = document.getElementById("font-family-select");
const fontSizeSlider = document.getElementById("font-size-slider");
const marginSliders = {
    top: document.getElementById("margin-slider-top"),
    right: document.getElementById("margin-slider-right"),
    bottom: document.getElementById("margin-slider-bottom"),
    left: document.getElementById("margin-slider-left"),
};
const lineHeightSlider = document.getElementById("line-height-slider");
const letterSpacingSlider = document.getElementById("letter-spacing-slider");
const wordSpacingSlider = document.getElementById("word-spacing-slider");
const textColorPicker = document.getElementById("text-color-picker");
const backgroundColorPicker = document.getElementById("background-color-picker");
const borderWidthSlider = document.getElementById("border-width-slider");
const borderRadiusSlider = document.getElementById("border-radius-slider");
const textShadowSlider = document.getElementById("text-shadow-slider");
const textTransformSelect = document.getElementById("text-transform-select");
const opacitySlider = document.getElementById("opacity-slider");
const customCssTextarea = document.getElementById("custom-css");

// Add paragraph button functionality
addParagraphBtn.addEventListener("click", () => {
    const paragraph = document.createElement("p");
    paragraph.id = generateId("paragraph");
    paragraph.textContent = "New Paragraph";
    document.querySelector(".working-space").appendChild(paragraph);

    updateHtmlCode();
    updateCssCode(paragraph);

    selectedElement = paragraph;
    highlightSelectedElement(paragraph);
});

// Apply styles dynamically
function applyStyle(property, value) {
    if (selectedElement) {
        selectedElement.style[property] = value;
        updateCssCode(selectedElement);
    }
}

// Style controls event listeners
alignSelect.addEventListener("change", () => applyStyle("textAlign", alignSelect.value));
fontFamilySelect.addEventListener("change", () => applyStyle("fontFamily", fontFamilySelect.value));
fontSizeSlider.addEventListener("input", () => applyStyle("fontSize", `${fontSizeSlider.value}px`));

Object.keys(marginSliders).forEach(side => {
    marginSliders[side].addEventListener("input", () =>
        applyStyle(`margin${side.charAt(0).toUpperCase() + side.slice(1)}`, `${marginSliders[side].value}px`)
    );
});

lineHeightSlider.addEventListener("input", () => applyStyle("lineHeight", lineHeightSlider.value));
letterSpacingSlider.addEventListener("input", () => applyStyle("letterSpacing", `${letterSpacingSlider.value}px`));
wordSpacingSlider.addEventListener("input", () => applyStyle("wordSpacing", `${wordSpacingSlider.value}px`));
textColorPicker.addEventListener("input", () => applyStyle("color", textColorPicker.value));
backgroundColorPicker.addEventListener("input", () => applyStyle("backgroundColor", backgroundColorPicker.value));
borderWidthSlider.addEventListener("input", () => applyStyle("borderWidth", `${borderWidthSlider.value}px`));
borderRadiusSlider.addEventListener("input", () => applyStyle("borderRadius", `${borderRadiusSlider.value}px`));
textShadowSlider.addEventListener("input", () =>
    applyStyle("textShadow", `0px 0px ${textShadowSlider.value}px rgba(0,0,0,0.5)`)
);
textTransformSelect.addEventListener("change", () => applyStyle("textTransform", textTransformSelect.value));
opacitySlider.addEventListener("input", () => applyStyle("opacity", opacitySlider.value));

// Apply custom CSS from textarea
customCssTextarea.addEventListener("input", () => {
    if (selectedElement) {
        selectedElement.style.cssText += customCssTextarea.value;
        updateCssCode(selectedElement);
    }
});

// Reset styles for the selected element
function resetStyles() {
    if (selectedElement) {
        selectedElement.style.cssText = "";
        updateCssCode(selectedElement);
    }
}
