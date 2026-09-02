/* ==========================================
   CONFIGURATION
   ========================================== */

const SECRET_CODE = "Mathsucks";

/*
   Put the URL of your SECOND Google Site here.

   Example:

   const DESTINATION_URL =
       "https://sites.google.com/view/docsmath/";
*/

const DESTINATION_URL = "https://sites.google.com/view/docsmath/";


/* ==========================================
   ELEMENTS
   ========================================== */

const editor = document.getElementById("editor");
const documentTitle = document.getElementById("documentTitle");

const wordCount = document.getElementById("wordCount");
const saveStatus = document.getElementById("saveStatus");

const notification = document.getElementById("notification");

const saveButton = document.getElementById("saveButton");
const printButton = document.getElementById("printButton");

const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");

const zoomSelect = document.getElementById("zoomSelect");
const paragraphStyle = document.getElementById("paragraphStyle");
const fontSelect = document.getElementById("fontSelect");
const fontSizeSelect = document.getElementById("fontSizeSelect");

const menuPopup = document.getElementById("menuPopup");


/* ==========================================
   NOTIFICATION
   ========================================== */

function showNotification(message) {

    notification.textContent = message;

    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 1800);
}


/* ==========================================
   WORD COUNT
   ========================================== */

function updateWordCount() {

    const text = editor.innerText.trim();

    if (!text) {
        wordCount.textContent = "0 words";
        return;
    }

    const words = text.split(/\s+/).filter(Boolean);

    wordCount.textContent =
        `${words.length} ${words.length === 1 ? "word" : "words"}`;
}


/* ==========================================
   LOCAL SAVE
   ========================================== */

function saveDocument() {

    const data = {
        title: documentTitle.value,
        content: editor.innerHTML
    };

    localStorage.setItem(
        "documentPortalData",
        JSON.stringify(data)
    );

    saveStatus.textContent = "Saved just now";

    setTimeout(() => {
        saveStatus.textContent = "All changes saved locally";
    }, 1800);
}


function loadDocument() {

    const stored =
        localStorage.getItem("documentPortalData");

    if (!stored) {
        return;
    }

    try {

        const data = JSON.parse(stored);

        if (data.title) {
            documentTitle.value = data.title;
        }

        if (data.content) {
            editor.innerHTML = data.content;
        }

    } catch (error) {

        console.error(
            "Could not load saved document:",
            error
        );
    }
}


/* ==========================================
   SECRET CODE
   ========================================== */

function checkSecretCode() {

    if (
        !SECRET_CODE ||
        SECRET_CODE === "YOUR-SECRET-CODE-HERE"
    ) {
        return;
    }

    const text = editor.innerText;

    if (
        text
            .toLowerCase()
            .includes(SECRET_CODE.toLowerCase())
    ) {

        /*
           Only redirect when an actual destination
           has been configured.
        */

        if (
            !DESTINATION_URL ||
            DESTINATION_URL === "YOUR-SECOND-SITE-URL-HERE"
        ) {

            showNotification(
                "Secret code detected — configure the destination URL."
            );

            return;
        }

        saveDocument();

        /*
           Redirect the entire browser window rather
           than only changing the embedded frame.
        */

        try {

            window.top.location.href = DESTINATION_URL;

        } catch (error) {

            window.location.href = DESTINATION_URL;
        }
    }
}


/* ==========================================
   EDITOR INPUT
   ========================================== */

editor.addEventListener("input", () => {

    updateWordCount();

    saveStatus.textContent = "Saving...";

    clearTimeout(window.saveTimer);

    window.saveTimer = setTimeout(() => {
        saveDocument();
    }, 600);

    checkSecretCode();
});


/* ==========================================
   DOCUMENT TITLE
   ========================================== */

documentTitle.addEventListener("input", () => {

    saveStatus.textContent = "Saving...";

    clearTimeout(window.titleSaveTimer);

    window.titleSaveTimer = setTimeout(() => {
        saveDocument();
    }, 600);

});


/* ==========================================
   FORMATTING
   ========================================== */

document
    .querySelectorAll("[data-command]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const command =
                button.dataset.command;

            document.execCommand(
                command,
                false,
                null
            );

            editor.focus();

        });

    });


/* ==========================================
   UNDO / REDO
   ========================================== */

undoButton.addEventListener("click", () => {

    document.execCommand(
        "undo",
        false,
        null
    );

    editor.focus();

});


redoButton.addEventListener("click", () => {

    document.execCommand(
        "redo",
        false,
        null
    );

    editor.focus();

});


/* ==========================================
   FONT
   ========================================== */

fontSelect.addEventListener("change", () => {

    document.execCommand(
        "fontName",
        false,
        fontSelect.value
    );

    editor.focus();

});


/* ==========================================
   FONT SIZE
   ========================================== */

fontSizeSelect.addEventListener("change", () => {

    document.execCommand(
        "fontSize",
        false,
        fontSizeSelect.value
    );

    editor.focus();

});


/* ==========================================
   PARAGRAPH STYLE
   ========================================== */

paragraphStyle.addEventListener("change", () => {

    document.execCommand(
        "formatBlock",
        false,
        paragraphStyle.value
    );

    editor.focus();

});


/* ==========================================
   ZOOM
   ========================================== */

zoomSelect.addEventListener("change", () => {

    const zoom =
        Number(zoomSelect.value) / 100;

    document.querySelector(".document-page").style.transform =
        `scale(${zoom})`;

    document.querySelector(".document-page").style.transformOrigin =
        "top center";

});


/* ==========================================
   SAVE
   ========================================== */

saveButton.addEventListener("click", () => {

    saveDocument();

    showNotification(
        "Document saved"
    );

});


/* ==========================================
   PRINT
   ========================================== */

printButton.addEventListener("click", () => {

    window.print();

});


/* ==========================================
   SHARE BUTTON
   ========================================== */

document
    .querySelector(".share-button")
    .addEventListener("click", () => {

        showNotification(
            "Sharing is unavailable in this project"
        );

    });


/* ==========================================
   MENU SYSTEM
   ========================================== */

const menuItems = {

    file: [
        ["New document", "new"],
        ["Save", "save"],
        ["Print", "print"]
    ],

    edit: [
        ["Undo", "undo"],
        ["Redo", "redo"],
        ["Select all", "select"]
    ],

    view: [
        ["Zoom 100%", "zoom100"],
        ["Zoom 125%", "zoom125"]
    ],

    insert: [
        ["Insert text", "insertText"],
        ["Insert line break", "lineBreak"]
    ],

    format: [
        ["Bold", "bold"],
        ["Italic", "italic"],
        ["Underline", "underline"]
    ],

    tools: [
        ["Word count", "wordCount"]
    ]

};


document
    .querySelectorAll(".menu-button")
    .forEach(button => {

        button.addEventListener("click", (event) => {

            event.stopPropagation();

            const menu =
                button.dataset.menu;

            const items =
                menuItems[menu] || [];

            menuPopup.innerHTML = "";

            items.forEach(([label, action]) => {

                const item =
                    document.createElement("div");

                item.className = "popup-item";

                item.textContent = label;

                item.addEventListener(
                    "click",
                    () => {

                        executeMenuAction(action);

                        menuPopup.classList.remove(
                            "visible"
                        );

                    }
                );

                menuPopup.appendChild(item);

            });

            const rect =
                button.getBoundingClientRect();

            menuPopup.style.left =
                `${rect.left}px`;

            menuPopup.style.top =
                `${rect.bottom + 2}px`;

            menuPopup.classList.add(
                "visible"
            );

        });

    });


document.addEventListener("click", () => {

    menuPopup.classList.remove(
        "visible"
    );

});


/* ==========================================
   MENU ACTIONS
   ========================================== */

function executeMenuAction(action) {

    switch (action) {

        case "new":

            editor.innerHTML = "";

            documentTitle.value =
                "Untitled document";

            updateWordCount();

            saveDocument();

            break;


        case "save":

            saveDocument();

            showNotification(
                "Document saved"
            );

            break;


        case "print":

            window.print();

            break;


        case "undo":

            document.execCommand(
                "undo"
            );

            break;


        case "redo":

            document.execCommand(
                "redo"
            );

            break;


        case "select":

            document.execCommand(
                "selectAll"
            );

            break;


        case "zoom100":

            zoomSelect.value = "100";
            zoomSelect.dispatchEvent(
                new Event("change")
            );

            break;


        case "zoom125":

            zoomSelect.value = "125";
            zoomSelect.dispatchEvent(
                new Event("change")
            );

            break;


        case "insertText":

            document.execCommand(
                "insertText",
                false,
                " "
            );

            editor.focus();

            break;


        case "lineBreak":

            document.execCommand(
                "insertHTML",
                false,
                "<br>"
            );

            editor.focus();

            break;


        case "bold":

            document.execCommand(
                "bold"
            );

            break;


        case "italic":

            document.execCommand(
                "italic"
            );

            break;


        case "underline":

            document.execCommand(
                "underline"
            );

            break;


        case "wordCount":

            updateWordCount();

            showNotification(
                wordCount.textContent
            );

            break;

    }

}


/* ==========================================
   KEYBOARD SHORTCUTS
   ========================================== */

document.addEventListener("keydown", event => {

    /*
       Ctrl/Cmd + S
    */

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "s"
    ) {

        event.preventDefault();

        saveDocument();

        showNotification(
            "Document saved"
        );

    }


    /*
       Ctrl/Cmd + P
    */

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "p"
    ) {

        event.preventDefault();

        window.print();

    }

});


/* ==========================================
   STARTUP
   ========================================== */

loadDocument();
updateWordCount();
