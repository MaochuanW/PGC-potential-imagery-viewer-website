// Global Exports
const sitePrefix = `/PGC-potential-imagery-viewer-website/`;

function printLog() {
    return true;
};


// Global Scripts
(function () {
    if (printLog() == true) {
        console.log("Loading Global");
    };

    // Meta
    let meta = document.createElement("meta");
    meta.onload = function () {
        if (printLog() == true) {
            console.log("Loaded Meta");
        };
    };
    meta.name = "viewport";
    meta.content = "initial-scale=1, maximum-scale=1, user-scalable=no";

    // Favicon
    let favicon = document.createElement("link");
    favicon.onload = function () {
        if (printLog() == true) {
            console.log("Loaded Icon");
        };
    };
    favicon.rel = "icon";
    favicon.href = sitePrefix + "assets/icons/favicon/favicon.ico";

    // Stylesheet
    let stylesheet = document.createElement("link");
    stylesheet.onload = function () {
        if (printLog() == true) {
            console.log("Loaded Stylesheet");
        };
    };
    stylesheet.rel = "stylesheet";
    stylesheet.href = sitePrefix + "styles/global.css";

    // Header
    let header = document.createElement("script");
    header.onload = function () {
        if (printLog() == true) {
            console.log("Loaded Header");
        };
    };
    header.src = sitePrefix + "scripts/header.js";
    header.type = "module";
    header.defer = true;

    // Footer
    let footer = document.createElement("script");
    footer.onload = function () {
        if (printLog() == true) {
            console.log("Loaded Footer");
        };
    };
    footer.src = sitePrefix + "scripts/footer.js";
    footer.type = "module";
    footer.defer = true;

    document.head.appendChild(meta);
    // document.head.appendChild(favicon);
    document.head.appendChild(stylesheet);
    // document.head.appendChild(header);
    // document.head.appendChild(footer);
})();