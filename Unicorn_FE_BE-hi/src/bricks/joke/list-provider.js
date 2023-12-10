//@@viewOn:imports
import { createComponent, Utils, useState, useDataList, useEffect, useRef } from "uu5g05";
import Config from "./config/config.js";
import Calls from "calls";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:helpers
//@@viewOff:helpers


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
    const shoppingListDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        loadNext: handleLoadNext,
        create: handleCreate,
      },
      itemHandlerMap: {
        update: handleUpdate,
        delete: handleDelete,
        getImage: handleGetImage,
      },
      pageSize: 3,
    });

    const imageUrlListRef = useRef([]);

    function handleLoad(dtoIn) {
      return Calls.ShoppingList.list(dtoIn);
    }

    function handleLoadNext(pageInfo) {
      const dtoIn = { pageInfo };
      return Calls.ShoppingList.list(dtoIn);
    }

    function handleCreate(values) {
      return Calls.ShoppingList.create(values);
    }

    async function handleUpdate(values) {
      return Calls.Joke.update(values);
    }

    function handleDelete(shoppingList) {
      const dtoIn = { id: shoppingList.id };
      return Calls.ShoppingList.delete(dtoIn, props.baseUri);
    }

    async function handleGetImage(shoppingList) {
      const dtoIn = { code: shoppingList.image };
      const imageFile = await Calls.ShoppingList.getImage(dtoIn);
      const imageUrl = generateAndRegisterImageUrl(imageFile);
      return { ...shoppingList, imageFile, imageUrl };
    }

    function generateAndRegisterImageUrl(imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      imageUrlListRef.current.push(imageUrl);
      return imageUrl;
    }

    useEffect(() => {
      // We don't use it to store reference on another React component
      // eslint-disable-next-line uu5/hooks-exhaustive-deps
      return () => imageUrlListRef.current.forEach((url) => URL.revokeObjectURL(url));
      // We want to trigger this effect only once.
      // eslint-disable-next-line uu5/hooks-exhaustive-deps
    }, []);
    //@@viewOff:private
    

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(shoppingListDataList) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports
