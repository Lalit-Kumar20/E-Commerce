window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "12px 10px";
    document.getElementById("logo").style.fontSize = "25px";
      
} else {
    document.getElementById("navbar").style.padding = "21px 10px";
    document.getElementById("logo").style.fontSize = "35px";
    
  }
}
