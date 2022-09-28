import "admin-lte/dist/css/adminlte.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import './style.css'
import "admin-lte/dist/js/adminlte.min";
import {injectAll} from "./src/utils/html_include";
import Studio from "./src/Studio.js";

document.addEventListener("DOMContentLoaded", async() => {
    document.body.querySelector(".wrapper").style.display = '';
    await injectAll()
    new Studio().init();
})
