// Function to include HTML snippets in an .html file

// Code taken from tutorial:
// https://www.w3schools.com/howto/howto_html_include.asp
//  - added comments
//  - cleaned up the formatting
//  - made slight modifications to naming
//  - changed from internal script to external js file

console.log("%cincludeHTML.js is loaded!", "color:green")


function includeHTML() {

    console.log("includeHTML Executed!");

    var z, i, elmnt, file, xhttp;
    
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
    
        /* select elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html-snip");
        console.log(file);
    
        if (file) {
            /* Make request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
        
            xhttp.onreadystatechange = function() {
                /* readyState 4 means response received*/
                if (this.readyState == 4) {

                    /* check for errors: */
                    if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                    if (this.status == 404) {elmnt.innerHTML = "Page not found.";}

                    /* Remove the attribute, and call this function again: */
                    elmnt.removeAttribute("w3-include-html-snip");
                    includeHTML();
                }
            }

            /* Add the snippet */
            xhttp.open("GET", file, true);
            xhttp.send();

            /* Exit the function: */
            return;
        }
    }
}
