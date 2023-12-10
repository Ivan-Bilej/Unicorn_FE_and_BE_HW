//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useEffect, useRoute, useLsi, useUserPreferences } from "uu5g05";
import { Box, Text, Line, Button, DateTime, Pending } from "uu5g05-elements";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  main: () =>
    Config.Css.css({
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }),

  header: () =>
    Config.Css.css({
      display: "block",
      padding: 16,
      height: 48,
    }),

  content: (image) =>
    Config.Css.css({
      display: "flex",
      alignItems: image ? "center" : "left",
      justifyContent: image ? "center" : "flex-start",
      height: "calc(100% - 48px - 48px)",
      overflow: "hidden",
    }),

  text: () =>
    Config.Css.css({
      display: "block",
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 16,
    }),

  image: () => Config.Css.css({ width: "100%" }),

  footer: () =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 48,
      marginTop: 8,
      paddingLeft: 16,
      paddingRight: 8,
    }),

  infoLine: () =>
    Config.Css.css({
      display: "block",
      marginLeft: 16,
      marginTop: 8,
    }),
};
//@@viewOff:css

//@@viewOn:helpers
function InfoLine({ children }) {
  return (
    <Text
      category="interface"
      segment="content"
      type="medium"
      significance="subdued"
      colorScheme="building"
      className={Css.infoLine()}
    >
      {children}
    </Text>
  );
}

function hasManagePermission(shoppingList, identity, profileList) {
  const isAuthority = profileList.includes("Authorities");
  const isExecutive = profileList.includes("Executives");
  /**
     * REMOVE "//" AFTER useSession WORKS AND uuApp LOGIN WORKS
     * REMOVE LINE "const { identity } = {identitiy: "6565-1"}"
     * */
  //const isOwner = shoppingList.uuIdentity === identity.uuIdentity;
  const isOwner = shoppingList.uuIdentity === identity;
  return isAuthority || (isExecutive && isOwner);
}
//@@viewOff:helpers

const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

   //@@viewOn:propTypes
  propTypes: {
    shoppingListDataObject: PropTypes.object.isRequired,
    itemList: PropTypes.array,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    itemList: []
  },
  //@@viewOff:defaultProps

  render(props) {
    const [preferences] = useUserPreferences();
    const lsi = useLsi(importLsi, [Tile.uu5Tag]);

    useEffect(() => {
      if (
        props.shoppingListDataObject.data.image &&
        !props.shoppingListDataObject.data.imageUrl &&
        props.shoppingListDataObject.state === "ready" &&
        props.shoppingListDataObject.handlerMap?.getImage
      ) {
        props.shoppingListDataObject.handlerMap
          .getImage(props.shoppingListDataObject.data)
          .catch((error) => Tile.logger.error("Error loading image", error));
      }
    }, [props.shoppingListDataObject]);

    function handleDelete(event) {
      event.stopPropagation();
      props.onDelete(props.shoppingListDataObject);
    }

    function handleUpdate(event) {
      event.stopPropagation();
      props.onUpdate(props.shoppingListDataObject);
    }

    function handleDetail() {
      props.onDetail(props.shoppingListDataObject);
    }

    function buildItemNames(itemIdList) {
      // for faster lookup
      let itemIds = new Set(itemIdList);
      return props.itemList
        .reduce((acc, item) => {
          if (itemIds.has(item.id)) {
            acc.push(item.name);
          }
          return acc;
        }, [])
        .join(", ");
    }
    //@@viewOff:private
    
    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props, Css.main());
    const shoppingList = props.shoppingListDataObject.data;
    const canManage = hasManagePermission(shoppingList, props.identity, props.profileList);
    const isActionDisabled = props.shoppingListDataObject.state === "pending";

    return (
      <Box {...elementProps} onClick={handleDetail}>
        <Text category="interface" segment="title" type="minor" colorScheme="building" className={Css.header()}>
          {shoppingList.name}
        </Text>

        <div>
          <Text category="interface" segment="content" type="medium" colorScheme="building" className={Css.text()}>
            {shoppingList.description}
          </Text>
        </div>

        <div className={Css.content(shoppingList.image)}>
          {shoppingList.text && !shoppingList.image && (
            <Text category="interface" segment="content" type="medium" colorScheme="building" className={Css.text()}>
              {shoppingList.text}
            </Text>
          )}
          {shoppingList.imageUrl && <img src={shoppingList.imageUrl} alt={shoppingList.name} className={Css.image()} />}
          {shoppingList.image && !shoppingList.imageUrl && <Pending size="xl" />}
        </div>

        <Line significance="subdued" />

        {shoppingList.itemIdList?.length > 0 && <InfoLine>{buildItemNames(shoppingList.itemIdList)}</InfoLine>}

        <InfoLine>{shoppingList.id}</InfoLine>
        <InfoLine>{shoppingList.uuIdentityName}</InfoLine>

        <InfoLine>
          <DateTime value={shoppingList.sys.cts} dateFormat="short" timeFormat="none" />
        </InfoLine>

        <Box significance="distinct" className={Css.footer()}>
          {Utils.String.format(lsi.averageRating, Utils.Number.format(shoppingList.averageRating.toFixed(shoppingList.averageRating % 1 ? 1 : 0), {
              groupingSeparator: preferences.numberGroupingSeparater,
              decimalSeparator: preferences.numberDecimalSeparator,
            })
          )}
          {canManage && (
            <div>
              <Button icon="mdi-pencil" onClick={handleUpdate} significance="subdued" tooltip={lsi.updateTip} disabled={isActionDisabled}/>
              <Button icon="mdi-delete" onClick={handleDelete} significance="subdued" tooltip={lsi.deleteTip} disabled={isActionDisabled}/>
            </div>
          )
        };
        </Box>
      </Box>
    );
  },
});

//@@viewOn:exports
export { Tile };
export default Tile;
//@@viewOff:exports
