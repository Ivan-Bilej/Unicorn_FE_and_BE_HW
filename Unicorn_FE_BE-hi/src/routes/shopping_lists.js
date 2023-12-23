//@@viewOn:imports
import { createVisualComponent, useSession, useScreenSize } from "uu5g05";
import { withRoute, RouteController } from "uu_plus4u5g02-app";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar.js";
import ListTitle from "../bricks/joke/list-title.js";
import ListProvider from "../bricks/joke/list-provider.js";
import ListView from "../bricks/joke/list-view.js";
import CreateView from "../bricks/joke/create-view.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  //container: () => Config.Css.css({ maxWidth: 640, margin: "0px auto" }),
  container: (screenSize) => {
    let maxWidth;

    switch (screenSize) {
      case "xs":
      case "s":
        maxWidth = "100%";
        break;
      case "m":
      case "l":
        maxWidth = 640;
        break;
      case "xl":
      default:
        maxWidth = 1280;
    }

    return Config.Css.css({ maxWidth: maxWidth, margin: "0px auto", paddingLeft: 8, paddingRight: 8 });
  },
  createView: () => Config.Css.css({ margin: "24px 0px" }),
};
//@@viewOff:css

let ShoppingLists = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Shopping Lists",
  //@@viewOff:statics

  render() {
    //@@viewOn:private
    const subAppDataObject = useSubAppData();
    const systemDataObject = useSystemData();
    /**
     * REMOVE "//" AFTER useSession WORKS AND uuApp LOGIN WORKS
     * REMOVE LINE "const { identity } = {identitiy: "6565-1"}"
     * */
    //const { identity } = useSession();
    const { identity } = {identity: "6565-1"}
    const [screenSize] = useScreenSize();
    
    const profileList = systemDataObject.data.profileData.uuIdentityProfileList;
    const canCreate = profileList.includes("Authorities") || profileList.includes("Executives");
    //@@viewOff:private
    
    //@@viewOn:render
    return (
      <>
        <RouteBar />
        <ListProvider>
          {(shoppingListDataList) => (
            <RouteController routeDataObject={shoppingListDataList}>
              <div className={Css.container(screenSize)}>
                {canCreate && 
                  <CreateView 
                    shoppingListDataList={shoppingListDataList} 
                    itemList={subAppDataObject.data.itemList}
                    className={Css.createView()} 
                  />}
                <ListView 
                  shoppingListDataList={shoppingListDataList} 
                  itemList={subAppDataObject.data.itemList}
                  profileList={profileList}
                  identity={identity}
                />
                <ListTitle shoppingListList={shoppingListDataList.data} />
              </div>
            </RouteController>
          )}
        </ListProvider>
      </>
    );
    //@@viewOff:render
  },
});

ShoppingLists = withRoute(ShoppingLists, { authenticated: false });

//@@viewOn:exports
export { ShoppingLists };
export default ShoppingLists;
//@@viewOff:exports