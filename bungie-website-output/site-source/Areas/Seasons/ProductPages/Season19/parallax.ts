import { get } from "js-cookie";

interface IParallaxOptions {
  // Decimal value that controls what portion of the viewport the element needs to be for all calculations
  viewable?: number;
}

const defaultOptions: IParallaxOptions = {
  viewable: 0,
};

export default function parallax(
  element: HTMLElement,
  parallaxOptions: IParallaxOptions = {}
) {
  if (!element) {
    throw new Error("element is required for parallax");
  }

  const options = {
    ...defaultOptions,
    ...parallaxOptions,
  };

  const layers = Array.from(element.querySelectorAll<HTMLElement>(".layer"));
  const layersData: {
    node: HTMLElement;
    speed: number;
    min: number;
    max: number;
    centered?: string;
  }[] = layers.map((layer) => ({
    node: layer,
    speed: layer.dataset.speed && Number(layer.dataset.speed),
    min: layer.dataset.min && parseInt(layer.dataset.min),
    max: layer.dataset.max && parseInt(layer.dataset.max),
    centered: layer.dataset.centered,
  }));

  let raf: number;
  let offsetTop = 0;
  let scrollY = 0;
  let deltaScrollY = 0;
  // No smooth scrolling atm
  // const ease = 1 / 4;
  const ease = 1;

  function getLayout() {
    offsetTop = element.offsetTop;
  }

  function position() {
    // Apply a delta to the scroll so it's smoother.
    deltaScrollY = deltaScrollY + (scrollY - deltaScrollY) * ease;

    for (const layer of layersData) {
      let y =
        (deltaScrollY - offsetTop) * layer.speed +
        window.innerHeight * options.viewable;

      y = layer.max !== undefined ? Math.max(layer.max, y) : y;
      y = layer.min !== undefined ? Math.min(layer.min, y) : y;

      layer.node.style.transform = `translate3d(${
        layer.centered ? "-50%" : "0"
      }, ${y}px, 0)`;
    }

    raf = window.requestAnimationFrame(position);
  }

  function onScroll() {
    scrollY = window.scrollY;
  }

  function init() {
    getLayout();
    onScroll();

    window.addEventListener("resize", getLayout);
    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    position();
  }

  function destroy() {
    window.cancelAnimationFrame(raf);
    window.removeEventListener("resize", getLayout);
    window.removeEventListener("scroll", onScroll);
  }

  return {
    init,
    destroy,
  };
}
