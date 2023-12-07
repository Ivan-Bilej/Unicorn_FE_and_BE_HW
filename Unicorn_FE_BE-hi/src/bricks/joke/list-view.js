//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, Content, useRef } from "uu5g05";
import { Button, Pending, useAlertBus } from "uu5g05-elements";
import Tile from "./tile";
import Config from "./config/config.js";
//import ShoppingLists from "../../routes/shopping_lists.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  tile: () => Config.Css.css({ marginBottom: 24 }),
  buttonArea: () => Config.Css.css({ textAlign: "center", marginBottom: 24 }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const ListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListView",
  //nestingLevel: ["areaCollection", "area"],
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    shoppingListDataList: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    const nextPageIndexRef = useRef(1);

    function showError(error, header = "") {
      addAlert({
        header,
        message: error.message,
        priority: "error",
      });
    }

    async function handleDelete(shoppingListDataObject) {
      try {
        await shoppingListDataObject.handlerMap.delete();
      } catch (error) {
        ListView.logger.error("Error deleting shopping list", error);
        showError(error, "Shopping list delete failed!");
        return;
      }

      addAlert({
        message: `The shopping list ${shoppingListDataObject.data.name} has been deleted.`,
        priority: "success",
        durationMs: 2000,
      });
    }

    async function handleUpdate(shoppingListDataObject) {
      try {
        await shoppingListDataObject.handlerMap.update();
      } catch (error) {
        ListView.logger.error("Error updating shopping list", error);
        showError(error, "Shopping list update failed!");
      }
    }

    async function handleLoadNext() {
      try {
        await props.shoppingListDataList.handlerMap.loadNext({ pageInfo: { pageIndex: nextPageIndexRef.current } });
        nextPageIndexRef.current++;
      } catch (error) {
        ListView.logger.error("Error loading next page", error);
        showError(error, "Page loading failed!");
      }
    }
    //@@viewOff:private


    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const shoppingListList = props.shoppingListDataList.data.filter((item) => item !== undefined);

    return (
      <div {...attrs}>
        {shoppingListList.map((item) => (
          <Tile
            key={item.data.id}
            shoppingListDataObject={item}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            className={Css.tile()}
          />
        ))}
        <div className={Css.buttonArea()}>
          {props.shoppingListDataList.state !== "pending" && (
            <Button colorScheme="primary" onClick={handleLoadNext}>
              Load next 3 shopping lists
            </Button>
          )}
          {props.shoppingListDataList.state === "pending" && <Pending />}
        </div>
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports
