//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, Content } from "uu5g05";
import { useAlertBus } from "uu5g05-elements";
import Tile from "./tile";
import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: () => Config.Css.css({}),
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
    jokeList: PropTypes.array.isRequired,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    jokeList: [],
    onUpdate: () => {},
    onDelete: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();

    function showError(error, header = "") {
      addAlert({
        header,
        message: error.message,
        priority: "error",
      });
    }

    function handleDelete(event) {
      const joke = event.data;

      try {
        props.onDelete(joke);
        addAlert({
          message: `The joke ${joke.name} has been deleted.`,
          priority: "success",
          durationMs: 2000,
        });
      } catch (error) {
        ListView.logger.error("Error deleting joke", error);
        showError(error, "Joke delete failed!");
      }
    }

    function handleUpdate(event) {
      try {
        props.onUpdate(event.data);
      } catch (error) {
        ListView.logger.error("Error updating joke", error);
        showError(error, "Joke update failed!");
      }
    }
    //const { children } = props;
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main());
    //const currentNestingLevel = Utils.NestingLevel.getNestingLevel(props, ListView);

    return (
      <div {...attrs}>
        {props.jokeList.map((joke) => (
          <Tile
            key={joke.id}
            joke={joke}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            style={{ width: 640, margin: "24px auto" }}
          />
        ))}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports
