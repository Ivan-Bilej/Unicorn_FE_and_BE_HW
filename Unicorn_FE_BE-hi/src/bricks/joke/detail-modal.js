//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes, useLsi, useLanguage, useUserPreferences } from "uu5g05";
import { Modal, Box, Line, Text, DateTime } from "uu5g05-elements";
import { PersonPhoto } from "uu_plus4u5g02-elements";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  content: () =>
    Config.Css.css({
      width: "100%",
    }),

  image: () =>
    Config.Css.css({
      display: "block",
      width: "100%",
      margin: "auto",
    }),

  text: (modal) =>
    Config.Css.css({
      display: "block",
      marginLeft: modal.style.paddingLeft,
      marginRight: modal.style.paddingRight,
      marginTop: modal.style.paddingTop,
      marginBottom: modal.style.paddingTop,
    }),

  infoLine: (modal) =>
    Config.Css.css({
      display: "block",
      marginLeft: modal.style.paddingLeft,
      marginTop: 8,
    }),

  footer: (modal) =>
    Config.Css.css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      marginTop: 8,
      paddingTop: modal.style.paddingBottom,
      paddingBottom: modal.style.paddingBottom,
      paddingLeft: modal.style.paddingLeft,
      paddingRight: modal.style.paddingRight,
    }),

  photo: () =>
    Config.Css.css({
      marginRight: 8,
    }),
};
//@@viewOff:css

//@@viewOn:helpers
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

function InfoLine(props) {
  const { elementProps } = Utils.VisualComponent.splitProps(props);

  return (
    <Text
      {...elementProps}
      category="interface"
      segment="content"
      type="medium"
      significance="subdued"
      colorScheme="building"
    >
      {props.children}
    </Text>
  );
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
//@@viewOff:helpers

const DetailModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DetailModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    shoppingListDataObject: PropTypes.object.isRequired,
    itemList: PropTypes.array,
    onClose: PropTypes.func,
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
    //@@viewOn:private
    const [preferences] = useUserPreferences();
    const [language] = useLanguage();
    const lsi = useLsi(importLsi, [DetailModal.uu5Tag]);
    
    function getRatingCountLsi(ratingCount) {
      const pluralRules = new Intl.PluralRules(language);
      const rule = pluralRules.select(ratingCount);
      return lsi[`${rule}Votes`];
    }

    function getActions() {
      const isActionDisabled = props.shoppingListDataObject.state === "pending";
      const canManage = hasManagePermission(props.shoppingListDataObject.data, props.identity, props.profileList);
      let actionList = [];

      if (canManage) {
        actionList.push({
          icon: "mdi-pencil",
          children: lsi.update,
          onClick: () => props.onUpdate(props.shoppingListDataObject),
          disabled: isActionDisabled,
          primary: true,
        });

        actionList.push({
          icon: "mdi-delete",
          children: lsi.delete,
          onClick: () => props.onDelete(props.shoppingListDataObject),
          disabled: isActionDisabled,
          collapsed: true,
        });
      }

      return actionList;
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const shoppingList = props.shoppingListDataObject.data;

    return (
      <Modal header={shoppingList.name} onClose={props.onClose} actionList={getActions()} open>
        {(modal) => (
          <div className={Css.content()}>
            {shoppingList.text && (
              <Text
                category="interface"
                segment="content"
                type="medium"
                colorScheme="building"
                className={Css.text(modal)}
              >
                {shoppingList.text}
              </Text>
            )}

            {shoppingList.imageUrl && <img src={shoppingList.imageUrl} alt={shoppingList.name} className={Css.image()} />}

            <Line significance="subdued" />

            {shoppingList.categoryIdList?.length > 0 && (
              <InfoLine className={Css.infoLine(modal)}>
                {buildCategoryNames(shoppingList.categoryIdList, props.categoryList)}
              </InfoLine>
            )}

            <InfoLine className={Css.infoLine(modal)}>
              <DateTime value={shoppingList.sys.cts} dateFormat="short" timeFormat="none" />
            </InfoLine>

            <InfoLine className={Css.infoLine(modal)}>
              {Utils.String.format(getRatingCountLsi(shoppingList.ratingCount), shoppingList.ratingCount)}
            </InfoLine>

            <Box significance="distinct" className={Css.footer(modal)}>
              <span>
                <PersonPhoto uuIdentity={shoppingList.uuIdentity} size="xs" className={Css.photo()} />
                <Text category="interface" segment="content" colorScheme="building" type="medium">
                  {shoppingList.uuIdentityName}
                </Text>
              </span>
              <span>
                {Utils.String.format(
                  lsi.averageRating,
                  Utils.Number.format(shoppingList.averageRating.toFixed(shoppingList.averageRating % 1 ? 1 : 0), {
                    groupingSeparator: preferences.numberGroupingSeparater,
                    decimalSeparator: preferences.numberDecimalSeparator,
                  })
                )}
              </span>
            </Box>
          </div>
        )}
      </Modal>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DetailModal };
export default DetailModal;
//@@viewOff:exports
