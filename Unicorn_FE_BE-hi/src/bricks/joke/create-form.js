//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi, ContentSizeProvider } from "uu5g05";
import { Form, FormText, FormSelect, FormTextArea, SubmitButton, CancelButton, FormFile, FormLink } from "uu5g05-forms";
import { Grid, Modal } from "uu5g05-elements";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

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

const CreateForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    itemList: PropTypes.array,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    itemList: [],
    onSubmit: () => {},
    onCancel: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [CreateForm.uu5Tag]);

    function handleValidate(event) {
      const { text, image } = event.data.value;

      if (!text && !image) {
        return {
          message: lsi.textOrImage,
        };
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    return (
      <ContentSizeProvider>
        <Form {...elementProps} onSubmit={props.onSubmit} onValidate={handleValidate}>
          <Grid
            templateAreas={{
              xs: "name, itemIdList, image, imageUrl, description, controls",
              m: "name name, categoryIdList image, imageUrl, description description, controls controls",
            }}
            templateColumns={{ m: "1fr 1fr" }}
            gap={8}
          />

          <Grid.Item gridArea="name">
            <FormText label={lsi.name} name="name" maxLength={255} className={Css.input()} required autoFocus />
          </Grid.Item>
          
          <Grid.Item gridArea="itemIdList">
            <FormSelect
              label={lsi.item}
              name="itemIdList"
              itemList={getItemList(props.itemList)}
              className={Css.input()}
              multiple
            />
          </Grid.Item>
          
          <Grid.Item gridArea="image">
            <FormFile label={lsi.image} name="image" accept="image/*" className={Css.input()} />
          </Grid.Item>

          <Grid.Item gridArea="imageUrl">
            <FormText label={lsi.imageUrl} name="imageUrl" maxLength={255} className={Css.input()} required autoFocus />
          </Grid.Item>
          
          <Grid.Item gridArea="description">
            <FormTextArea label={lsi.text} name="description" maxLength={4000} rows={10} className={Css.input()} autoResize />
          </Grid.Item>


          <Grid.Item gridArea="controls" className={Css.controls()}>
            <CancelButton onClick={props.onCancel}>{lsi.cancel}</CancelButton>
            <SubmitButton>{lsi.submit}</SubmitButton>
          </Grid.Item>
        </Form>
      </ContentSizeProvider>
      
      /*
      <Modal header="Create shopping list" onClose={props.onClose} open>
        {(modal) => (
          <Form {...elementProps} onSubmit={props.onSubmit} className={Css.content}>
          <FormText name="name" label={lsi.name} required />
          <FormText name="description" label={lsi.description} required />
          <FormLink name="imageUrl" label="Insert Image URL path"/>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8 }}>
            <CancelButton onClick={props.onCancel}>{lsi.cancel}</CancelButton>
            <SubmitButton>{lsi.submit}</SubmitButton>
          </div>
          </Form>
        )}
      
      </Modal>*/

    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { CreateForm };
export default CreateForm;
//@@viewOff:exports