//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi } from "uu5g05";
import { Form, FormText, SubmitButton, CancelButton, FormFile, FormLink } from "uu5g05-forms";
import Config from "./config/config.js";
import { Modal } from "uu5g05-elements";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

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

const CreateForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onSubmit: () => {},
    onCancel: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    const lsi = useLsi(importLsi, [CreateForm.uu5Tag]);
    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    return (
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
      
      </Modal>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { CreateForm };
export default CreateForm;
//@@viewOff:exports