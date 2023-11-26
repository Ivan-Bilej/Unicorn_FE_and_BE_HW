//@@viewOn:imports
import { createComponent, Utils, useState, useDataList, useEffect, useRef } from "uu5g05";
import Config from "./config/config.js";
import Calls from "calls";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:helpers
//@@viewOff:helpers

// --- Test 3 section 5_1-Properties ---
const initialShoppingLists = [
  {
    id: Utils.String.generateId(),
    name: "Bunny ate the wedding ring!",
    description: "Why did the bunny eat the wedding ring? Because he heard it was 18 carrots!",
    imageUrl: "https://cdn.discordapp.com/attachments/1089449698550632450/1108048744630460517/image.png?ex=655cc84f&is=654a534f&hm=620914f08a2524c2143f52940365d17a8a6b8c5c84cefa3a07a739dc37b6267e&",
    averageRating: 4,
    uuIdentityName: "Ivan BIlej",
    sys: { cts: "2022-03-17T09:48:38.990Z" },
  },
  {
    id: Utils.String.generateId(),
    name: "Sushi Belt",
    description: "That's a perfect example of how sushi belts should look like.",
    imageUrl: "https://i.redd.it/kz4u53yzbkhb1.png",
    averageRating: 5,
    uuIdentityName: "Harry Potter",
    sys: { cts: "2022-02-14T10:48:38.990Z" },
  },
  {
    id: Utils.String.generateId(),
    name: "Random image",
    description: "Thats a FAT cat!!",
    imageUrl: "https://cdn.discordapp.com/attachments/1089449698550632450/1161035870086897756/image.png?ex=655bbfea&is=65494aea&hm=ae560d8c461eceff7f04f6f1a088d5c399665f1740ea2698acb06ddbc238bc26&",
    averageRating: 1,
    uuIdentityName: "Karel Kafka",
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
    const [shoppingLists, setshoppingLists] = useState(initialShoppingLists
    );


    function remove(shoppingList) {
      setshoppingLists((prevshoppingLists) => prevshoppingLists.filter((item) => item.id !== shoppingList.id));
    }

    function create(values) {
      const shoppingList = {
        ...values,
        id: Utils.String.generateId(),
        averageRating: Math.round(Math.random() * 5), // <0, 5>
        uuIdentityName: "Gerald of Rivia",
        sys: {
          cts: new Date().toISOString(),
        },
      };

      setshoppingLists((prevshoppingLists) => [...prevshoppingLists, shoppingList]);
      return shoppingList;
    }

    function update() {
      throw new Error("shoppingList update is not implemented yet.");
    }
    //@@viewOff:private

    //@@viewOn:render
    const value = { shoppingLists, remove, update, create };
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports
