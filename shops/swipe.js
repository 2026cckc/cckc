/*
  가게 페이지 좌우 넘기기
  - 손가락을 왼쪽으로 밀면 → 다음 가게 (01 → 02)
  - 손가락을 오른쪽으로 밀면 → 이전 가게 (02 → 01)
  - 컴퓨터에서는 키보드 ← → 화살표로도 넘어감
  - 페이지 주소(shop-01.html 등)에서 번호를 읽어서 앞뒤 페이지를 자동으로 찾음
*/
(function () {
  // 가게가 총 몇 개인지 (마지막 가게에서는 더 넘어가지 않음)
  var TOTAL = 10;

  var match = location.pathname.match(/shop-(\d+)\.html/);
  if (!match) return;

  var current = parseInt(match[1], 10);

  function pageUrl(n) {
    return "shop-" + String(n).padStart(2, "0") + ".html";
  }

  var prevUrl = current > 1 ? pageUrl(current - 1) : null;
  var nextUrl = current < TOTAL ? pageUrl(current + 1) : null;

  var page = document.querySelector(".page");
  var leaving = false;

  function go(url, direction) {
    if (!url || leaving) return;
    leaving = true;
    if (page) {
      page.style.transition = "transform 0.25s ease, opacity 0.25s ease";
      page.style.transform = "translateX(" + (direction === "next" ? "-30%" : "30%") + ")";
      page.style.opacity = "0";
    }
    setTimeout(function () {
      location.href = url;
    }, 220);
  }

  // 뒤로가기로 돌아왔을 때 화면이 사라진 채로 남아있지 않게
  window.addEventListener("pageshow", function () {
    leaving = false;
    if (page) {
      page.style.transition = "none";
      page.style.transform = "";
      page.style.opacity = "";
    }
  });

  var startX = 0;
  var startY = 0;
  var startTime = 0;
  var tracking = false;

  document.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) return;
    var x = e.touches[0].clientX;
    // 화면 맨 가장자리에서 시작한 건 무시 (아이폰 뒤로가기 제스처와 겹치지 않게)
    if (x < 25 || x > window.innerWidth - 25) {
      tracking = false;
      return;
    }
    startX = x;
    startY = e.touches[0].clientY;
    startTime = Date.now();
    tracking = true;
  }, { passive: true });

  document.addEventListener("touchend", function (e) {
    if (!tracking) return;
    tracking = false;

    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    var dt = Date.now() - startTime;

    // 가로로 충분히 밀었고, 세로 스크롤이 아니고, 너무 천천히 끈 게 아닐 때만
    if (Math.abs(dx) < 60) return;
    if (Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dt > 800) return;

    if (dx < 0) {
      go(nextUrl, "next");
    } else {
      go(prevUrl, "prev");
    }
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") go(nextUrl, "next");
    if (e.key === "ArrowLeft") go(prevUrl, "prev");
  });
})();
