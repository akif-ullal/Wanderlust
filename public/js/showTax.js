const btn = document.getElementById("switchCheckDefault");
const showTaxInfo = document.getElementsByClassName("gst");

btn.addEventListener("click", function () {
    for(info of showTaxInfo)
    {
        if(info.style.display !== "inline")
        {
            info.style.display = "inline";
        }else{
            info.style.display = "none";
        }
    }

});
