//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { Box, Text, Line, Button } from "uu5g05-elements";
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
  //nestingLevel: ["areaCollection", "area"],
  //@@viewOff:statics

  render() {
    //@@viewOn:private
    //const { children } = props;

    function handleDelete() {
      alert("I can't delete joke. I'm dumb visual component.");
    }

    function handleUpdate() {
      alert("I can't update joke. I'm dumb visual component.");
    }
    //@@viewOff:private

    //@@viewOn:render
    /*
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main());
    const currentNestingLevel = Utils.NestingLevel.getNestingLevel(props, Tile);

    return currentNestingLevel ? (
      <div {...attrs}>
        <div>Visual Component {Tile.uu5Tag}</div>
        <Content nestingLevel={currentNestingLevel}>{children}</Content>
      </div>
    ) : null;
    */

    return (
      <Box style={{ width: 640, margin: "24px auto" }}>
        <Text category="interface" segment="title" type="minor" colorScheme="building">
          New Years' resolution
        </Text>
        <div>
          <Text category="interface" segment="content" type="medium" colorScheme="building">
            My New Years' resolution is 8K.
          </Text>
        </div>
        <div>
          <img src="../assets/pngegg.png" width="400" height="300" />
        </div>
        <Line significance="subdued" />
        <div>
          <Text category="interface" segment="content" type="medium" significance="subdued" colorScheme="building">
            IT, sport, hardware
          </Text>
        </div>
        <div>
          <Text category="interface" segment="content" type="medium" significance="subdued" colorScheme="building">
            Jan Novák
          </Text>
        </div>
        <div>
          <Text category="interface" segment="content" type="medium" significance="subdued" colorScheme="building">
            17.03.2022
          </Text>
        </div>
        <Box significance="distinct">
          Average rating: 3 / 5
          <Button icon="mdi-pencil" onClick={handleUpdate} significance="subdued" tooltip="Update" />
          <Button icon="mdi-delete" onClick={handleDelete} significance="subdued" tooltip="Delete" />
        </Box>
      </Box>
    );

    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Tile };
export default Tile;
//@@viewOff:exports
