function  videoDisplayService($, videoDisplay) {

  var autoplay = "0";
  var download = true;

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
    // else if (facebookTest.test(hostname)) {
    //   return "facebook";
    // }
    // else if (vkTest.test(hostname)) {
    //   return "vk";
    // }
    // else if (twitterTest.test(hostname)) {
    //   return "twitter";
    // }
    else if(youtubeTest.test(hostname)) {
      return "youtube";
    }
  }


  function setVideoDisplay(videoUrl, cb) {
    switch (checkVideoSite(videoUrl)) {
      case "vimeo":
        return displayVimeoVideo(videoUrl, cb);
      // case "facebook":
      //   return getFacebookId(videoUrl);
      // case "vk":
      //   return getVKId(videoUrl);
      // case "twitter":
      //   return getTwitterId(videoUrl);
      // default:
      case "youtube":
        return displayYoutubeVideo(videoUrl, cb);
        break;
      default:
        cb(new Error("not supported"));
        break;
    }
  }

  // if the site is vimeo displays the vimeo video
  function displayVimeoVideo (videoUrl, cb) {
    var baseUrl = "https://player.vimeo.com/video/"
    var id = url("path", videoUrl).split("/").pop();

    var link = baseUrl + id;

    // adding parameters - they'll be default for now and not changing
    link += "?title=1&byline=1&potrait=0";

    // autoplay parameter
    link += "&autoplay=" + autoplay;

    var iframe = $("<iframe>")
      .attr("src", link)
      .attr("frameborder", "0")
      .attr("webkitallowfullscreen", "")
      .attr("mozallowfullscreen", "")
      .attr("allowfullscreen", "");

    videoDisplay.empty();
    videoDisplay.prepend(iframe);

    iframe.load(function(event) {
      cb(null, event);
    });

  }

  // iframe for displaying youtube video
  function displayYoutubeVideo (videoUrl, cb) {
    var baseUrl = "http://playit.pk/embed/";

    try {
      var v = url("?", videoUrl).v
    }
    catch (err) {
      return cb(err);
    }

    link = baseUrl + v;

    // extra parameters default for now
    link += "&logo=false";
    link += "&download=true";
    link += "&autoplay=true";

    // building an iframe based on it
    var iframe = $("<iframe>")
      .attr("src", link)
      .attr("frameborder", "0")
      .attr("webkitallowfullscreen", "")
      .attr("mozallowfullscreen", "")
      .attr("allowfullscreen", "");

    videoDisplay.empty();
    videoDisplay.prepend(iframe);


    iframe.load(function (event) {
      cb();
    })
  }

  function setAutoplay (auto) {
    console.log(auto);
    if (auto) {
      autoplay = "1";
    }
    else {
      autoplay = "0";
    }
  }

  function getAutoplay () {
    return autoplay;
  }


  return {
    checkVideoSite: checkVideoSite,
    setVideoDisplay: setVideoDisplay,
    setAutoplay: setAutoplay,
    getAutoplay: getAutoplay
    // setDownload: setDownload
  }
}
