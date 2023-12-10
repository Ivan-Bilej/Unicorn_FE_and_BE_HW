//@@viewOn:imports
import { createVisualComponent, PropTypes, useLsi } from "uu5g05";
import { Modal } from "uu5g05-elements";
import { Form, FormText, FormTextArea, FormSelect, FormFile, SubmitButton, CancelButton } from "uu5g05-forms";
import Config from "./config/config";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  input: () => Config.Css.css({ marginBottom: 16 }),
  controls: () => Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" }),
};
//@@viewOff:css

//@@viewOn:helpers
function getItemList(itemList) {
  return itemList.map((item) => {
    return { value: item.id, children: item.name };
  });
}
//@@viewOff:helpers

const UpdateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    shoppingListDataObject: PropTypes.object.isRequired,
    itemList: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    itemList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [UpdateModal.uu5Tag]);
    console.log(UpdateModal.uu5Tag)
    console.log(lsi)

    async function handleSubmit(event) {
      const values = { ...event.data.value };

      if (props.shoppingListDataObject.data.image && !values.image) {
        delete values.image;
        values.deleteImage = true;
      }

      return props.onSubmit(props.shoppingListDataObject, values);
    }

    function handleValidate(event) {
      const { text, image } = event.data.value;

      if (!text && !image) {
        return {
          message: lsi.textOrImage,
        };
      }
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const shoppingList = props.shoppingListDataObject.data;
    
    const formControls = (
      <div className={Css.controls()}>
        <CancelButton onClick={props.onCancel}>{lsi.cancel}</CancelButton>
        <SubmitButton>{lsi.submit}</SubmitButton>
      </div>
    );

    return (
      <Form.Provider onSubmit={handleSubmit} onValidate={handleValidate}>
        <Modal header={lsi.header} footer={formControls} open>
          <Form.View>
            <FormText
              label={lsi.name}
              name="name"
              initialValue={shoppingList.name}
              maxLength={255}
              className={Css.input()}
              required
              autoFocus
            />

            <FormSelect
              label={lsi.item}
              name="itemIdList"
              initialValue={shoppingList.itemIdList}
              itemList={getItemList(props.itemList)}
              className={Css.input()}
              multiple
            />

            <FormFile
              label={lsi.image}
              name="image"
              initialValue={shoppingList.imageFile}
              accept="image/*"
              className={Css.input()}
            />
            <FormText
              label={lsi.imageUrl}
              name="imageUrl"
              initialValue={shoppingList.imageUrl}
              maxLength={255}
              className={Css.input()}
              required
              autoFocus
            />

            <FormTextArea
              label={lsi.description}
              name="description"
              initialValue={shoppingList.description}
              maxLength={4000}
              rows={10}
              className={Css.input()}
              autoResize
            />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UpdateModal };
export default UpdateModal;
//@@viewOff:exports
