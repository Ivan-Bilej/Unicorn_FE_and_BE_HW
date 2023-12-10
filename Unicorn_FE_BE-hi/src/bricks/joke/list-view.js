//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, Content, useRef, useLsi, useState } from "uu5g05";
import { Button, Pending, useAlertBus } from "uu5g05-elements";
import Tile from "./tile";
import Config from "./config/config.js";
import DetailModal from "./detail-modal";
import UpdateModal from "./update-modal";
import importLsi from "../../lsi/import-lsi";
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
function getShoppingListDataObject(shoppingListDataList, id) {
  // HINT: We need to also check newData where are newly created items
  // that don't meet filtering, sorting or paging criteria.
  const item =
    shoppingListDataList.newData?.find((item) => item?.data.id === id) ||
    shoppingListDataList.data.find((item) => item?.data.id === id);

  return item;
}
//@@viewOff:helpers

const ListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListView",
  //nestingLevel: ["areaCollection", "area"],
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    shoppingListDataList: PropTypes.object.isRequired,
    /**
     * REMOVE "//" AFTER useSession WORKS AND uuApp LOGIN WORKS
     * REMOVE LINE "const { identity } = {identitiy: "6565-1"}"
     * */
    //identity: PropTypes.object.isRequired,
    identity: PropTypes.string.isRequired,
    itemList: PropTypes.array,
    profileList: PropTypes.array,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    itemList: [],
    profileList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    const nextPageIndexRef = useRef(1);
    const lsi = useLsi(importLsi, [ListView.uu5Tag]);
    const [detailData, setDetailData] = useState({ open: false, id: undefined });
    const [updateData, setUpdateData] = useState({ open: false, id: undefined });
    
    const activeDataObjectId = detailData.id || updateData.id;
    let activeDataObject;

    if (activeDataObjectId) {
      activeDataObject = getShoppingListDataObject(props.shoppingListDataList, activeDataObjectId);
    }

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
        showError(error, lsi.deleteFail);
        return;
      }

      addAlert({
        message: Utils.String.format(lsi.deleteDone, shoppingListDataObject.data.name),
        priority: "success",
        durationMs: 2000,
      });
    }

    async function handleUpdate(shoppingListDataObject) {
      setUpdateData({ open: true, id: shoppingListDataObject.data.id });
    }

    async function handleUpdateSubmit(shoppingListDataObject, values) {
      try {
        await shoppingListDataObject.handlerMap.update(values);
      } catch (error) {
        ListView.logger.error("Error updating joke", error);
        showError(error, lsi.updateFail, error);
        return;
      }

      setUpdateData({ open: false });
    }

    function handleUpdateCancel() {
      setUpdateData({ open: false });
    }

    async function handleLoadNext() {
      try {
        await props.shoppingListDataList.handlerMap.loadNext({ pageInfo: { pageIndex: nextPageIndexRef.current } });
        nextPageIndexRef.current++;
      } catch (error) {
        ListView.logger.error("Error loading next page", error);
        showError(error, lsi.pageLoadFail);
      }
    }

    const handleItemDetailOpen = (shoppingListDataObject) => setDetailData({ open: true, id: shoppingListDataObject.data.id });
    const handleItemDetailClose = () => setDetailData({ open: false });
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
            profileList={props.profileList}
            identity={props.identity}
            onDetail={handleItemDetailOpen}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            className={Css.tile()}
            itemList={props.itemList}
          />
        ))}
        <div className={Css.buttonArea()}>
          {props.shoppingListDataList.state !== "pending" && (
            <Button colorScheme="primary" onClick={handleLoadNext}>
              {lsi.loadNext}
            </Button>
          )}
          {props.shoppingListDataList.state === "pending" && <Pending />}
        </div>
        {detailData.open && activeDataObject && (
          <DetailModal
          shoppingListDataObject={activeDataObject}
            profileList={props.profileList}
            identity={props.identity}
            itemList={props.itemList}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onClose={handleItemDetailClose}
            open
          />
        )}
        {updateData.open && (
          <UpdateModal
            shoppingListDataObject={activeDataObject}
            categoryList={props.itemList}
            onSubmit={handleUpdateSubmit}
            onCancel={handleUpdateCancel}
            open
          />
        )}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports
