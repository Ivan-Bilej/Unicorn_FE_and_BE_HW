//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar.js";
import ListTitle from "../bricks/joke/list-title.js";
import ListProvider from "../bricks/joke/list-provider.js";
import ListView from "../bricks/joke/list-view.js";
import CreateView from "../bricks/joke/create-view.js";
//@@viewOff:imports

let ShoppingLists = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Home",
  //@@viewOff:statics

  render() {
    //@@viewOn:render
    return (
      <>
        <RouteBar />
        <ListProvider>
          {({ shoppingLists, remove, update, create }) => (
            <>
              <CreateView onCreate={create} style={{ maxWidth: 400, margin: "24px auto", display: "block" }} />
              <ListView shoppingLists={shoppingLists} onDelete={remove} onUpdate={update} />
              <ListTitle shoppingLists={shoppingLists} />
            </>
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