//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils } from "uu5g05";
import { Box, Text, Line, Button, DateTime } from "uu5g05-elements";
import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  main: () => Config.Css.css({}),
};
//@@viewOff:css


const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

   //@@viewOn:propTypes
   propTypes: {
    shoppingList: PropTypes.shape({
      name: PropTypes.string.isRequired,
      text: PropTypes.string,
      imageUrl: PropTypes.string,
      averageRating: PropTypes.number.isRequired,
      uuIdentityName: PropTypes.string.isRequired,
      sys: PropTypes.shape({
        cts: PropTypes.string,
      }),
    }).isRequired,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onUpdate: () => {},
    onDelete: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    function handleDelete(event) {
      props.onDelete(new Utils.Event(props.shoppingList, event));
    }

    function handleUpdate(event) {
      props.onUpdate(new Utils.Event(props.shoppingList, event));
    }
    //@@viewOff:private
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    return (
      <Box {...elementProps}>
        <Text category="interface" segment="title" type="minor" colorScheme="building">
          {props.shoppingList.name}
        </Text>
        <div>
          <Text category="interface" segment="content" type="medium" colorScheme="building">
            {props.shoppingList.description}
          </Text>
        </div>
        <div>
          <img width="300" height="300" src={props.shoppingList.imageUrl} />
        </div>
        <Line significance="subdued" />
        <div>
          <Text category="interface" segment="content" type="medium" significance="subdued" colorScheme="building">
            {props.shoppingList.uuIdentityName}
          </Text>
        </div>
        <div>
          <Text category="interface" segment="content" type="medium" significance="subdued" colorScheme="building">
            <DateTime value={props.shoppingList.sys.cts} />
          </Text>
        </div>
        <Box significance="distinct">
          {`Average rating: ${props.shoppingList.averageRating.toFixed(props.shoppingList.averageRating % 1 ? 1 : 0)} / 5`}
          <Button icon="mdi-pencil" onClick={handleUpdate} significance="subdued" tooltip="Update" />
          <Button icon="mdi-delete" onClick={handleDelete} significance="subdued" tooltip="Delete" />
        </Box>
      </Box>
    );
  },
});

//@@viewOn:exports
export { Tile };
export default Tile;
//@@viewOff:exports
