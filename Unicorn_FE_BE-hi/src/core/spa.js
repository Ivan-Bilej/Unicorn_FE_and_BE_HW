//@@viewOn:imports
import { createVisualComponent, Utils, useSession, Environment } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App, { SpaPending, Error } from "uu_plus4u5g02-app";
import { Unauthenticated } from "uu_plus4u5g02-elements";

import Config from "./config/config.js";
import Home from "../routes/home.js";
import ShoppingListDetail from "../routes/shopping_list_detail.js";
//@@viewOff:imports

//@@viewOn:constants
const ShoppingLists = Utils.Component.lazy(() => import("../routes/shopping_lists.js"));
const ShoppingListDetails = Utils.Component.lazy(() => import("../routes/shopping_list_detail.js"));
const About = Utils.Component.lazy(() => import("../routes/about.js"));
const InitAppWorkspace = Utils.Component.lazy(() => import("../routes/init-app-workspace.js"));
const ControlPanel = Utils.Component.lazy(() => import("../routes/control-panel.js"));

const ROUTE_MAP = {
  "": { redirect: "home" },
  home: (props) => <Home {...props} />,
  shopping_lists: (props) => <ShoppingLists {...props} />,
  about: (props) => <About {...props} />,
  "sys/uuAppWorkspace/initUve": (props) => <InitAppWorkspace {...props} />,
  controlPanel: (props) => <ControlPanel {...props} />,
  shopping_list_detail: (props) => <ShoppingListDetails {...props} />,
  "*": { redirect: "home" },
    /*() => (
    <Uu5Elements.Text category="story" segment="heading" type="h1">
      Not Found
    </Uu5Elements.Text>
  ),
  */
};
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

const Spa = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Spa",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider initialLanguageList={["en", "cs", "uk"]} baseUri={Environment.get("callsBaseUri")}>
        <Plus4U5App.Spa routeMap={ROUTE_MAP} />
      </Plus4U5.SpaProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Spa };
export default Spa;
//@@viewOff:exports
