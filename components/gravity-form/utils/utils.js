/**
 * Helpers for Gfrom things
 */

//https://gist.github.com/andjosh/6764939
export const animateScrollTo = (to, duration) => {
    const element = document.scrollingElement || document.documentElement;
    const start = element.scrollTop;
    const change = to - start;
    const startDate = +new Date();
    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    const easeInOutQuad = (t, b, c, d) => {
      let t2 = t;
      t2 /= d / 2;
      if (t2 < 1) return (c / 2) * t2 * t2 + b;
      t2 -= 1;
      return (-c / 2) * (t2 * (t2 - 2) - 1) + b;
    };
    const animateScroll = () => {
      const currentDate = +new Date();
      const currentTime = currentDate - startDate;
      element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration), 10);
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollTop = to;
      }
    };
    animateScroll();
  };