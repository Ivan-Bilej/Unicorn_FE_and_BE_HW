//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils } from "uu5g05";
import { Form, FormText, SubmitButton, CancelButton, FormFile, FormLink } from "uu5g05-forms";
import Config from "./config/config.js";
import { Modal } from "uu5g05-elements";
//@@viewOff:imports

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
    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    return (
      <Modal header="Create shopping list" onClose={props.onClose} open>
        {(modal) => (
          <Form {...elementProps} onSubmit={props.onSubmit}>
          <FormText name="name" label="Name" required />
          <FormText name="description" label="Description" required />
          <FormLink name="imageUrl" label="Insert Image URL path"/>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8 }}>
            <CancelButton onClick={props.onCancel}>Cancel</CancelButton>
            <SubmitButton>Create Shopping List</SubmitButton>
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