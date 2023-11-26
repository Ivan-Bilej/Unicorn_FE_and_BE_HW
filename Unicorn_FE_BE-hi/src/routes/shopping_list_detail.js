//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar.js";
import Tile from "../bricks/joke/tile.js";
//@@viewOff:imports

function getArrayByName(name) {
  return arrayOfJSON.find(item => item.name === name) || null;
}

let ShoppingListDetail = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Home",
  //@@viewOff:statics

  render(props) {
    //@@viewOn:render
    return (
      //Testing of the specified Shopping list View 
      <>
        <RouteBar />
        {props.shoppingLists.map((shoppingList) => (
          <Tile
            key={shoppingList.id}
            shoppingList={shoppingList}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            style={{ width: 640, margin: "24px auto" }}
          />
        ))}
        
      </>
    );
    //@@viewOff:render
  },
});

ShoppingListDetail = withRoute(ShoppingListDetail, { authenticated: false });

//@@viewOn:exports
export { ShoppingListDetail };
export default ShoppingListDetail;
//@@viewOff:exports