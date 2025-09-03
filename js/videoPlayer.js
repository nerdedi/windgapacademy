// Video.js homepage logic
export function setupVideoPlayer() {
  const videoSection = document.createElement("section");
  videoSection.innerHTML =
    '<link href="//vjs.zencdn.net/8.23.4/video-js.min.css" rel="stylesheet">' +
    '<video id="my-player" class="video-js" controls preload="auto" poster="//vjs.zencdn.net/v/oceans.png" data-setup="{}">' +
    '<source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source>' +
    '<source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>' +
    '<source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source>' +
    '<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>' +
    "</video>" +
    '<script src="//vjs.zencdn.net/8.23.4/video.min.js"></script>';
  document.body.appendChild(videoSection);

  window.addEventListener("DOMContentLoaded", () => {
    if (window.videojs) {
      var options = {};
      var player = window.videojs("my-player", options, function onPlayerReady() {
        window.videojs.log("Your player is ready!");
        this.play();
        this.on("ended", function () {
          window.videojs.log("Awww...over so soon?!");
        });
      });
    }
  });
}
