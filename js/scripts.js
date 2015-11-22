//IIFE cos you never populate the global space
(function(){
  var baseUrl = "http://s.ytapi.com/embed/"
  var baseYTUrl = "http://playit.pk/embed/*?logo=false&download=true"

  // an array of supported sites with their chip name and image location for their chip
  var supportedSites = [
    // {
    //   "name":"Facebook",
    //   "chipImage":"img/chipimages/facebook.png",
    //   "siteLink":"https://facebook.com"
    // },
    {
      "name": "Youtube",
      "chipImage":"img/chipimages/youtube.png",
      "siteLink":"https://youtube.com"
    },
    {
      "name":"Vimeo",
      "chipImage":"img/chipimages/vimeo.png",
      "siteLink":"https://vimeo.com"
    }
    // {
    //   "name":"Twitter",
    //   "chipImage":"img/chipimages/twitter.png",
    //   "siteLink":"https://twitter.com"
    // },
    // {
    //   "name":"VK",
    //   "chipImage":"img/chipimages/vk.png",
    //   "siteLink":"https://vk.com/"
    // }
  ];

  $(document).ready(function(){
    // first time autoplay switch
    if (getAutoplayCookie() == "true") {
      $("autoplaySwitch").prop("checked", true);
    }

    $("#supportedVideoSites").prepend(supportSitesChips());
    serveVideo = videoDisplayService($, $("#videoDisplay"));

    hideLoadingRing();

    // event listener on search bar
    var previousSearch = "";
    var currentSearch = "";

    $("#search").focusout(function(){
      hideErrorBox();
      currentSearch = $(this).val();
      if (previousSearch != currentSearch && currentSearch != "") {
        previousSearch = currentSearch;

        var videoSite = serveVideo.checkVideoSite(currentSearch);

        $("#videoDisplay").hide();
        setRingColor(videoSite);
        colorizeChip(videoSite);
        showLoadingRing();


        serveVideo.setVideoDisplay(currentSearch, function (err) {
          hideLoadingRing();
          if (err) {
            showErrorBox("Video was not found!", "Sorry the video on the following link was not found!");
          }
          else {
            $("#videoDisplay").show();
          }
        });
      }
    });

    $("#autoplaySwitch").change(function(){
      var checked = $(this).prop("checked");
      setAutoplay(checked, serveVideo);
    })

  });

  function showErrorBox (title, message) {
    if (title) {
      $("#errorBoxTitle").text(title);
    }
    if (message) {
      $("#errorBoxMessage").text(message);
    }

    $("#errorBox").show();
  }

  function hideErrorBox () {
    $("#errorBox").hide();
  }


  function supportSitesChips () {
    var chips = [];
    supportedSites.forEach(function(value, index, array) {
      var chip = chipMaker(value.name, value.chipImage);
      chips.push(chip);
    });

    return chips;
  }
  // takes 2 parameters and creates a chip with optional image
  function chipMaker(tag, imgSrc, linkSite) {
    if (imgSrc) {
      var imageTag = $("<img>")
        .attr("src", imgSrc)
        .attr("alt", tag + "Chip");
    }


    var chip = $("<div>")
      .addClass("chip")
      .attr("id", tag.toLowerCase() + "Chip")
      .text(tag)
      .prepend(imageTag);

    return chip;

  }

  // colors the chip if the site matches the following identified one
  // according to the sites color given here
  function colorizeChip(site) {
    // removing all the colors from chips first
    $("#supportedVideoSites").children().each(function(index, elem) {
      $(elem).attr("class").split(" ").forEach(function(value, index, array) {
        if (value != "chip") {
          $(elem).removeClass(value);
        }
      })
    });

    switch (site) {
      case "facebook":
        $("#facebookChip")
          .addClass("blue")
          .addClass("white-text");
        break;
      case "twitter":
        $("#twitterChip")
          .addClass("light-blue")
          .addClass("white-text");
        break;
      case "vk":
        $("#vkChip")
          .addClass("white")
          .addClass("blue-text");
        break;
      case "vimeo":
        $("#vimeoChip")
          .addClass("white")
          .addClass("cyan-text");
        break;
      case "youtube":
        $("#youtubeChip")
          .addClass("white")
          .addClass("red-text");
      default:
        break;
    }
  }

  // sets the color of the pre loading ring displayed before iframe
  // is loaded fully with video
  // and emits the load event
  function setRingColor(videoSite) {
    var spinner = $("#spinner");

    var spinnerGeneralColor = "spinner-*-only";

    // remove the previous colors
    spinner.attr("class").split(" ").forEach(function(value, index, array) {
      spinnerColorRegEx = /spinner-[a-z]*-only/
      if (spinnerColorRegEx.test(value)){
        spinner.removeClass(value);
      }
    });

    // setting the color according to the video
    switch (videoSite) {
      case "youtube":
        spinner.addClass(spinnerGeneralColor.replace("*", "red"));
        break;
      case "facebook":
        spinner.addClass(spinnerGeneralColor.replace("*", "blue"));
        break;
      case "vimeo":
        spinner.addClass(spinnerGeneralColor.replace("*", "cyan"));
        break;
      case "vk":
        spinner.addClass(spinnerGeneralColor.replace("*", "purple"));
        break;
      case "twitter":
        spinner.addClass(spinnerGeneralColor.replace("*", "blue-grey"));
        break;
      default:
        spinner.addClass(spinnerGeneralColor.replace("*", "green"));
        break;
    }
  }

  function hideLoadingRing () {
    var spinner = $("#ringLoader");
    spinner.hide();
  }

  function showLoadingRing () {
    var spinner = $("#ringLoader");
    spinner.show();
  }

  function setAutoplay (autoplay, serveVideo) {
    serveVideo.setAutoplay(autoplay);
    setAutoplayCookie(autoplay);
  }

  function setAutoplayCookie (autoplay) {
    Cookies.set("autoplay", autoplay, {expires: 10});
  }

  function getAutoplayCookie () {
    return Cookies.get("autoplay");
  }


}());
