//IIFE cos you never populate the global space
(function(){
  var baseUrl = "http://s.ytapi.com/embed/"
  var baseYTUrl = "http://playit.pk/embed/*?logo=false&download=true"

  // an array of supported sites with their chip name and image location for their chip
  var supportedSites = [
    {
      "name":"Facebook",
      "chipImage":"img/chipimages/facebook.png",
      "siteLink":"https://facebook.com"
    },
    {
      "name": "Youtube",
      "chipImage":"img/chipimages/youtube.png",
      "siteLink":"https://youtube.com"
    },
    {
      "name":"Vimeo",
      "chipImage":"img/chipimages/vimeo.png",
      "siteLink":"https://vimeo.com"
    },
    {
      "name":"Twitter",
      "chipImage":"img/chipimages/twitter.png",
      "siteLink":"https://twitter.com"
    },
    {
      "name":"VK",
      "chipImage":"img/chipimages/vk.png",
      "siteLink":"https://vk.com/"
    }
  ];

  function checkAutoplayCookie () {
    var autoplay = Cookies.get("autoplay");
    if (autoPlay == 1) {
      $("#autoplaySwitch").prop("checked", true);
    }
  }

  $(document).ready(function(){
    $("#supportedVideoSites").prepend(supportSitesChips());
    hideLoadingRing();
    // event listener on search bar
    var previousSearch = "";
    var currentSearch = "";
    $("#search").focusout(function(){
      currentSearch = $(this).val();
      if (previousSearch != currentSearch && currentSearch != "") {
        $("#videoFrame").hide();
        previousSearch = currentSearch;
        setFrameUrl(currentSearch);
      }
    });


    $("#videoFrame").load(function() {
      hideLoadingRing();
      $("#videoFrame").show();
    })

  });

  function getVideoId(videoUrl, site) {
    switch (checkVideoSite(videoUrl)) {
      case "vimeo":
        return getVimeoId(videoUrl);
      case "facebook":
        return getFacebookId(videoUrl);
      case "vk":
        return getVKId(videoUrl);
      case "twitter":
        return getTwitterId(videoUrl);
      default:
      case "youtube":
        return getYoutubeId(videoUrl);
        break;
    }
  }

  function checkVideoSite (videoUrl) {

    var hostname = url("hostname", videoUrl);
    var vimeoTest = /vimeo.com/
    var facebookTest = /facebook.com/
    var vkTest = /vk.com/
    var twitterTest = /twitter.com/
    var youtubeTest = /youtube.com/

    if (vimeoTest.test(hostname)) {
      return "vimeo";
    }
    else if (facebookTest.test(hostname)) {
      return "facebook";
    }
    else if (vkTest.test(hostname)) {
      return "vk";
    }
    else if (twitterTest.test(hostname)) {
      return "twitter";
    }
    else if(youtubeTest.test(hostname)) {
      return "youtube";
    }
  }

  // set the url of the iframe to load the video
  function setFrameUrl(videoLink) {
    var videoSite = checkVideoSite(videoLink);

    // sets the color and shows the loading ring
    setRingColor(videoSite);
    showLoadingRing();

    var videoId = getVideoId(videoLink);

    colorizeChip(videoSite);

    if (videoSite != "youtube") {
      var link = baseUrl + videoId;
    }
    else {
      var link = baseYTUrl.replace("*", videoId);
    }

    // first query element check if first one in the link and
    // use ? or & accordingly
    if (link.indexOf("?") != -1) {
      link += "&";
    }
    else {
      link += "?";
    }

    // autoplay on or off
    link += "autoplay=" + (isAuto() ? "1":"0");
    console.log(link);
    $("#videoFrame").attr("src", link);
  }

  function getVimeoId(videoUrl) {
    var prefix = "vm";

    var id = url("path", videoUrl).split("/").pop();

    return idPrefixer(prefix, id);
  }

  function getFacebookId(videoUrl) {
    var prefix = "fb";
    var id = url("path", videoUrl).split("/").pop();

    return idPrefixer(prefix, id);
  }

  function getVKId(videoUrl) {
    var prefix = "vk";
    var id = url("?", videoUrl).z.match(/video([-][0-9]*_[0-9]*)/)[1];
    return idPrefixer(prefix, id);
  }

  function getTwitterId(videoUrl) {
    var prefix = "tw";
    var id = url("path", videoUrl).split("/").pop();
    return idPrefixer(prefix, id);
  }

  function getYoutubeId(videoUrl) {
    var id = url("?",videoUrl).v;
    return id;
  }


  function idPrefixer(prefix, id) {
    return prefix + "." + id;
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
    $("#facebookChip").removeClass("blue white-text");
    $("#twitterChip").removeClass("light-blue white-text");
    $("#vkChip").removeClass("white blue-text");
    $("#vimeoChip").removeClass("white cyan-text");
    $("#youtubeChip").removeClass("white red-text");
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

  function isAuto() {
    return $("#autoplaySwitch").prop("checked");
  }

}());
