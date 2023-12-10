//@@viewOn:imports
import { createVisualComponent, Lsi, Utils, useRoute, useContext, useLsi } from "uu5g05";
import { useSubAppData } from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import importLsi from "../lsi/import-lsi.js";
import ShoppingListsContext from "../bricks/joke/context";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const RouteBar = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "RouteBar",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [, setRoute] = useRoute();
    const subAppDataObject = useSubAppData();
    const lsi = useLsi(importLsi, [RouteBar.uu5Tag]);

    const appActionList = [
      { children: lsi.home, onClick: () => setRoute("home") },
      { children: lsi.shopping_lists, onClick: () => setRoute("shopping_lists") },
      { children: lsi.about, onClick: () => setRoute("about"), collapsed: true },
    ];
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Plus4U5App.RouteBar appActionList={appActionList} {...props}>
        <Plus4U5App.RouteHeader title={Utils.String.format(lsi.title, subAppDataObject.data.name)} />
      </Plus4U5App.RouteBar>
    );
    //@@viewOff:render
  },

    /*const appActionList = [
      { children: <Lsi import={importLsi} path={["Menu", "home"]} />, onClick: () => setRoute("home") },
      { children: <Lsi import={importLsi} path={["Menu", "shopping_lists"]} />, onClick: () => setRoute("shopping_lists") },
      {
        children: <Lsi import={importLsi} path={["Menu", "about"]} />,
        onClick: () => setRoute("about"),
        collapsed: true,
      },
    ];
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
    <Plus4U5App.RouteBar appActionList={appActionList} {...props}>
      <Plus4U5App.RouteHeader title={"" + subAppDataObject.data.name} />
    </Plus4U5App.RouteBar>
    );
    //@@viewOff:render
  },*/
});

//@@viewOn:exports
export { RouteBar };
export default RouteBar;
//@@viewOff:exports
