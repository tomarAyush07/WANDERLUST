gsap.registerPlugin(Flip);
const body = document.body;
const content = document.querySelector(".content");
const enterButton = document.querySelector(".enter");
const fullview = document.querySelector(".fullview");
const grid = document.querySelector(".grid");
const gridRows = grid.querySelectorAll(".row");
let winsize = { width: window.innerWidth, height: window.innerHeight };
        window.addEventListener("resize", () => {
        winsize = { width: window.innerWidth, height: window.innerHeight };
});
let mousepos = { x: winsize.width / 2, y: winsize.height / 2 };
    const config = {
        translateX: true,
        skewX: false,
        contrast: true,
        scale: false,
        brightness: true
};
const numRows = gridRows.length;
const middleRowIndex = Math.floor(numRows / 2);
const middleRow = gridRows[middleRowIndex];
const middleRowItems = middleRow.querySelectorAll(".row__item");
const numRowItems = middleRowItems.length;
const middleRowItemIndex = Math.floor(numRowItems / 2); 
    const middleRowItemInner = middleRowItems[middleRowItemIndex].querySelector(
    ".row__item-inner"
);
const middleRowItemInnerImage = middleRowItemInner.querySelector(
  ".row__item-img"
);
middleRowItemInnerImage.classList.add("row__item-img--large");
const baseAmt = 0.1; 
const minAmt = 0.05; 
const maxAmt = 0.1; 
let renderedStyles = Array.from({ length: numRows }, (v, index) => {
  const distanceFromMiddle = Math.abs(index - middleRowIndex);
  const amt = Math.max(baseAmt - distanceFromMiddle * 0.03, minAmt);
  const scaleAmt = Math.min(baseAmt + distanceFromMiddle * 0.03, maxAmt);
            let style = { amt, scaleAmt };

            if (config.translateX) {
                style.translateX = { previous: 0, current: 0 };
            }
            if (config.skewX) {
                style.skewX = { previous: 0, current: 0 };
            }
            if (config.contrast) {
                style.contrast = { previous: 100, current: 100 };
            }
            if (config.scale) {
                style.scale = { previous: 1, current: 1 };
            }
            if (config.brightness) {
                style.brightness = { previous: 100, current: 100 };
            }

            return style;
});
let requestId;
const getMousePos = (ev) => {
  let posx = 0;
  let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            posx = ev.pageX;
            posy = ev.pageY;
        } else if (ev.clientX || ev.clientY) {
            posx =
            ev.clientX +
            document.body.scrollLeft +
            document.documentElement.scrollLeft;
            posy =
            ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x: posx, y: posy };
};
const updateMousePosition = (ev) => {
  const pos = getMousePos(ev);
  mousepos.x = pos.x;
  mousepos.y = pos.y;
};
const lerp = (a, b, n) => (1 - n) * a + n * b;
const calculateMappedX = () => {
  return (((mousepos.x / winsize.width) * 2 - 1) * 40 * winsize.width) / 100;
};
const calculateMappedSkew = () => {
  return ((mousepos.x / winsize.width) * 2 - 1) * 3;
};
const calculateMappedContrast = () => {
  const centerContrast = 100;
  const edgeContrast = 330;
  const t = Math.abs((mousepos.x / winsize.width) * 2 - 1);
  const factor = Math.pow(t, 2);
  return centerContrast - factor * (centerContrast - edgeContrast);
};
const calculateMappedScale = () => {
  const centerScale = 1;
  const edgeScale = 0.95;
  return (
    centerScale -
    Math.abs((mousepos.x / winsize.width) * 2 - 1) * (centerScale - edgeScale)
  );
};
const calculateMappedBrightness = () => {
  const centerBrightness = 100;
  const edgeBrightness = 15;
  const t = Math.abs((mousepos.x / winsize.width) * 2 - 1);
  const factor = Math.pow(t, 2); 
  return centerBrightness - factor * (centerBrightness - edgeBrightness);
};

const getCSSVariableValue = (element, variableName) => {
  return getComputedStyle(element).getPropertyValue(variableName).trim();
};
const render = () => {
  const mappedValues = {
    translateX: calculateMappedX(),
    skewX: calculateMappedSkew(),
    contrast: calculateMappedContrast(),
    scale: calculateMappedScale(),
    brightness: calculateMappedBrightness()
  };
  gridRows.forEach((row, index) => {
    const style = renderedStyles[index];
    for (let prop in config) {
      if (config[prop]) {
        style[prop].current = mappedValues[prop];
        const amt = prop === "scale" ? style.scaleAmt : style.amt;
        style[prop].previous = lerp(
          style[prop].previous,
          style[prop].current,
          amt
        );
      }
    }
let gsapSettings = {};
    if (config.translateX) gsapSettings.x = style.translateX.previous;
    if (config.skewX) gsapSettings.skewX = style.skewX.previous;
    if (config.scale) gsapSettings.scale = style.scale.previous;
    if (config.contrast)
      gsapSettings.filter = `contrast(${style.contrast.previous}%)`;
    if (config.brightness)
      gsapSettings.filter = `${
        gsapSettings.filter ? gsapSettings.filter + " " : ""
      }brightness(${style.brightness.previous}%)`;

    gsap.set(row, gsapSettings);
  });
  requestId = requestAnimationFrame(render);
};
const startRendering = () => {
  if (!requestId) {
    render();
  }
};
const stopRendering = () => {
  if (requestId) {
    cancelAnimationFrame(requestId);
    requestId = undefined;
  }
};

// const enterFullview = () => {
//   const flipstate = Flip.getState(middleRowItemInner);
//   fullview.appendChild(middleRowItemInner);
//   const transContent = getCSSVariableValue(content, "--trans-content");
//   const tl = gsap.timeline();
//   tl.add(
//     Flip.from(flipstate, {
//       duration: 0.9,
//       ease: "power4",
//       absolute: true,
//       onComplete: stopRendering
//     })
//   )
//     .to(
//       grid,
//       {
//         duration: 0.9,
//         ease: "power4",
//         opacity: 0.01
//       },
//       0
//     )
//     .to(
//       middleRowItemInnerImage,
//       {
//         scale: 1.2,
//         duration: 3,
//         ease: "sine"
//       },
//       "<-=0.45"
//     )
//     .to(content, {
//       y: transContent, 
//       duration: 0.9,
//       ease: "power4"
//     });
//   enterButton.classList.add("hidden");
//   body.classList.remove("noscroll");
// };




// const enterFullview = () => {
//   const flipstate = Flip.getState(middleRowItemInner);
//   const newContentContainer = document.createElement('div');
//   newContentContainer.innerHTML = `
//     <div class="parallax">
//       <section class="parallax__header">
//         <div class="parallax__visuals">
//           <div class="parallax__black-line-overflow"></div>
//           <div data-parallax-layers class="parallax__layers">
//             <img src="paralleximage/parallex.webp" loading="eager" width="800" data-parallax-layer="1" alt="" class="parallax__layer-img">
//             <img src="paralleximage/parallex2.webp" loading="eager" width="800" data-parallax-layer="2" alt="" class="parallax__layer-img">
//             <div data-parallax-layer="3" class="parallax__layer-title">
//               <h2 class="parallax__title">WanderLust</h2>
//             </div>
//             <img src="paralleximage/parallex3.webp" loading="eager" width="800" data-parallax-layer="4" alt="" class="parallax__layer-img">
//           </div>
//           <div class="parallax__fade"></div>
//         </div>
//       </section>
//       <section class="parallax__content">
//         <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 160 160" fill="none" class="osmo-icon-svg"><path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor"></path></svg>
//       </section>
//     </div>
//   `;
//   newContentContainer.style.opacity = 0;
//   document.body.appendChild(newContentContainer);

//   const transContent = getCSSVariableValue(content, "--trans-content");
//   const tl = gsap.timeline({
//     onComplete: () => {
//       stopRendering();
//       content.remove(); 
//     }
//   });

//   tl.add(
//     Flip.from(flipstate, {
//       duration: 0.9,
//       ease: "power4",
//       absolute: true
//     })
//   )
//     .to(grid, {
//       duration: 0.9,
//       ease: "power4",
//       opacity: 0
//     }, 0)
//     .to(newContentContainer, {
//       opacity: 1,
//       duration: 1,
//       ease: "power2"
//     });

//   enterButton.classList.add("hidden");
//   body.classList.remove("noscroll");
// };





// const init = () => {
//   startRendering();
//   enterButton.addEventListener("click", enterFullview);
//   enterButton.addEventListener("touchstart", enterFullview);
// };



const enterFullview = () => {
  const flipstate = Flip.getState(middleRowItemInner);
  fullview.appendChild(middleRowItemInner);
  const overlay = document.createElement("div");
  overlay.className = "transition-overlay";
  document.body.appendChild(overlay);

  const tl = gsap.timeline({
    onComplete: () => {
      window.location.href = "home.html";
    },
  });

  tl.add(
    Flip.from(flipstate, {
      duration: 1.2,
      ease: "expo.inOut",
      absolute: true,
    })
  )
    .to(
      middleRowItemInnerImage,
      {
        scale: 1.5,
        duration: 1.4,
        ease: "expo.inOut",
      },
      "<"
    )
    .to(
      grid,
      {
        opacity: 0,
        duration: 1.2,
        ease: "power4.inOut",
        y: -50,
      },
      0
    )
    .to(
      overlay,
      {
        scaleY: 1,
        duration: 1.2,
        ease: "expo.inOut",
      },
      "-=0.8"
    )
    .to(
      "body",
      {
        backgroundColor: "#000",
        duration: 1.2,
        ease: "expo.inOut",
      },
      "<"
    );

  enterButton.classList.add("hidden");
};

const init = () => {
  startRendering();
  enterButton.addEventListener("click", enterFullview);
  enterButton.addEventListener("touchstart", enterFullview);
};
init();



window.addEventListener("mousemove", updateMousePosition);
window.addEventListener("touchmove", (ev) => {
  const touch = ev.touches[0];
  updateMousePosition(touch);
});
const initSmoothScrolling = () => {
  const lenis = new Lenis({ lerp: 0.15 });
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
};
initSmoothScrolling();
init();
