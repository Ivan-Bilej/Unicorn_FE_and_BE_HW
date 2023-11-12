//@@viewOn:imports
import { createComponent, Utils } from "uu5g05";
import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:helpers
//@@viewOff:helpers

// --- Test 3 section 5_1-Properties ---
let jokeList = [
  {
    id: Utils.String.generateId(),
    name: "Bunny ate the wedding ring!",
    text: "Why did the bunny eat the wedding ring? Because he heard it was 18 carrots!",
    averageRating: 4,
    uuIdentityName: "John Smith",
    sys: { cts: "2022-03-17T09:48:38.990Z" },
  },
  {
    id: Utils.String.generateId(),
    name: "F5",
    text: "I love the F5 key. It´s just so refreshing.",
    averageRating: 3,
    uuIdentityName: "Harry Potter",
    sys: { cts: "2022-02-14T10:48:38.990Z" },
  },
  {
    id: Utils.String.generateId(),
    name: "Random image",
    imageUrl: "https://placeimg.com/640/320/any",
    averageRating: 1,
    uuIdentityName: "Bart Simpson",
    sys: { cts: "2021-02-14T10:48:38.990Z" },
  },
];


const ListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //--- Test 3 section 5_1-Properties ---
    function remove(joke) {
      jokeList = jokeList.filter((item) => item.id !== joke.id);
    }

    function update() {
      throw new Error("Joke update is not implemented yet.");
    }


    // --- Test Main ---
    //const { children } = props;
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    //--- Test 3 section 5_1-Properties ---
    const value = { jokeList, remove, update };
    return typeof props.children === "function" ? props.children(value) : props.children;


    // --- Test Main ---
    //return children ?? null;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports
