import UnicornFEBE from "Unicorn_FE_BE-hi";
import { testProperties } from "uu5g05-test";

const CONFIG = {
  props: {
    // left: {
    //   values: ["Left as text", <span key="l">Left as JSX</span>, 0],
    // },
  },
  requiredProps: {
    // children: "Children content",
  },
};

describe(`UnicornFEBE.Bricks.Joke.DetailModal`, () => {
  testProperties(UnicornFEBE.Bricks.Joke.DetailModal, CONFIG);
});