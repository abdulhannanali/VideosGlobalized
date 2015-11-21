//IIFE cos you never populate the global space
(function(){

  // an array of supported sites with their chip name and image location for their chip
  var supportedSites = [
    {
      "name":"Facebook",
      "chipImage":"img/chipimages/facebook.png"
    },
    {
      "name": "Youtube",
      "chipImage":"img/chipimages/youtube.png"
    },
    {
      "name":"Vimeo",
      "chipImage":"img/chipimages/vimeo.png"
    },
    {
      "name":"Yahoo",
      "chipImage":"img/chipimages/yahoo.png"
    },
    {
      "name":"Twitter",
      "chipImage":"img/chipimages/twitter.png"
    },
    {
      "name":"VK",
      "chipImage":"img/chipimages/vk.png"
    },
    {
      "name":"OK",
      "chipImage":"img/chipimages/ok.jpg"
    }
  ]

  $(document).ready(function(){
    $("#supportedVideoSites").prepend(supportSitesChips());
  });

  function supportSitesChips () {
    var chips = [];
    supportedSites.forEach(function(value, index, array) {
      var chip = chipMaker(value.name, value.chipImage);
      chips.push(chip);
    });

    return chips;
  }

  // takes 2 parameters and creates a chip with optional image
  function chipMaker(tag, imgSrc) {
    if (imgSrc) {
      var imageTag = $("<img>")
        .attr("src", imgSrc)
        .attr("alt", tag + "Chip");
    }

    var chip = $("<div>")
      .addClass("chip")
      .text(tag)
      .prepend(imageTag);

    console.log("chip made");
    return chip;

  }
}());
