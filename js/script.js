let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange(); //calling the function(optional)

});

searchBtn.addEventListener("click", () => { // Sidebar open when you click on the search iocn
    sidebar.classList.toggle("open");
    menuBtnChange(); //calling the function(optional)
});


// following are the code to change sidebar button(optional)
function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //replacing the iocns class
        // $('#collapseOne').show();
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //replacing the iocns class
        // $('#collapseOne').toggleClass('d-none');
    }
}
$(document).ready(function () {
    console.log("this runn1")
    $('#btn').click();
})

// $("#btn").click(function(){
//     if(sideBar.hasClass('open')){
//         $('#collapseOne').show();
//         sideBar.addClass('open');
//     }else{
//         $('#collapseOne').toggleClass('d-none');
//         sideBar.removeClass('open');
//     }
// })

// $('#btn').click(function() {
//     SidebarCollapse();
//     console.log("running this");
// });
// function SidebarCollapse(){
//     $('.sidebar-submenu').toggleClass('d-none');
//     var headingOne = $('.sidebar-submenu');
//     if(headingOne.hasClass('d-none')){
//         $('.sidebar-submenu').toggleClass('d-flex');
//         headingOne.removeClass('d-none');
//     }else{
//         $('.sidebar-submenu').toggleClass('d-none');
//     }
// }
// function SidebarCollapse () {
//     $('.menu-collapsed').toggleClass('d-none');
//     $('.sidebar-submenu').toggleClass('d-none');
//     $('#headingOne').toggleClass('d-none');
//     $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');

//     // Treating d-flex/d-none on separators with title
//     var SeparatorTitle = $('.sidebar-separator-title');
//     if ( SeparatorTitle.hasClass('d-flex') ) {
//         SeparatorTitle.removeClass('d-flex');
//     } else {
//         SeparatorTitle.addClass('d-flex');
//     }

//     // Collapse/Expand icon
//     $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
// }
// $('#btn').on("click", function () {
//     console.log("runningClick");
//     var headingOne = document.getElementById("headingOne");
//     headingOne.setAttribute("aria-expanded","false");
//     $('#headingOne').prop("aria-expanded","false");
// })