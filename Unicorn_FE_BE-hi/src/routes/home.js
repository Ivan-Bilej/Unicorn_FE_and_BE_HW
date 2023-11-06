//@@viewOn:imports
import { Utils, createVisualComponent, useSession, Lsi } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5Elements from "uu_plus4u5g02-elements";
import { withRoute } from "uu_plus4u5g02-app";
import Tile from "../bricks/joke/tile";
import Config from "./config/config.js";
import WelcomeRow from "../bricks/welcome-row.js";
import RouteBar from "../core/route-bar.js";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  icon: () =>
    Config.Css.css({
      fontSize: 48,
      lineHeight: "1em",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

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

let Home = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Home",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps
    

  render() {
    //@@viewOn:private
    function handleUpdate(event) {
      alert(
        `You want to update joke ${event.data.name} and you ${
          event.ctrlKey || event.metaKey ? "have" : "haven't"
        } used CTRL or META key.`
      );
    }

    function handleDelete(event) {
      alert(
        `You want to delete joke ${event.data.name}  and you ${
          event.ctrlKey || event.metaKey ? "have" : "haven't"
        } used CTRL or META key.`
      );
    }
    //@@vieOff:private

    //--- Test 4 section 5_2-Properties ---
    //@@viewOn:render
    return jokeList.map((joke) => (
      <Tile
        key={joke.id}
        joke={joke}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        style={{ width: 640, margin: "24px auto" }}
      />
    ));
    //@@viewOff:render

    //--- Test 3 section 5_1-Properties ---
    /*
    //@@viewOn:render
    return (
      <>
        <Tile
          joke={{
            name: "Bunny ate the wedding ring!",
            text: "Why did the bunny eat the wedding ring? Because he heard it was 18 carrots!",
            averageRating: 4,
            uuIdentityName: "John Smith",
            sys: { cts: "2022-03-17T09:48:38.990Z" },
          }}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          style={{ width: 640, margin: "24px auto" }}
        />
        <Tile
          joke={{
            name: "F5",
            text: "I love the F5 key. It´s just so refreshing.",
            averageRating: 3,
            uuIdentityName: "Harry Potter",
            sys: { cts: "2022-02-14T10:48:38.990Z" },
          }}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          style={{ width: 640, margin: "24px auto" }}
        />
        <Tile
          joke={{
            name: "Random image",
            imageUrl: "https://placeimg.com/640/320/any",
            averageRating: 1,
            uuIdentityName: "Bart Simpson",
            sys: { cts: "2021-02-14T10:48:38.990Z" },
          }}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          style={{ width: 640, margin: "24px auto" }}
        />
      </>
    );
    //@@viewOff:render
    */

    //--- Test 1 from section 4-Component ---
      /*
    //@@viewOn:render
    return (
      <>
        <h1>My message to the World:</h1>
        <div>
          <b>Hello </b>
          <i>World!</i>
        </div>
        <Tile/>
        <Tile/>
        <Tile/>
      </>
    );
    //@@viewOff:render
    */
    
    
    //--- Main text ---
    /*
    //@@viewOn:private
    const { identity } = useSession();
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    return (
      <div {...attrs}>
        <RouteBar />
        <WelcomeRow left={<Plus4U5Elements.PersonPhoto size="xl" borderRadius="none" />}>
          <Uu5Elements.Text category="story" segment="heading" type="h2">
            <Lsi import={importLsi} path={["Home", "welcome"]} />
          </Uu5Elements.Text>
          {identity && (
            <Uu5Elements.Text category="story" segment="heading" type="h2">
              {identity.name}
            </Uu5Elements.Text>
          )}
        </WelcomeRow>
        <WelcomeRow left={<Uu5Elements.Icon icon="mdi-human-greeting" className={Css.icon()} />}>
          <Uu5Elements.Text category="story" segment="body" type="common">
            <Lsi import={importLsi} path={["Home", "intro"]} />
          </Uu5Elements.Text>
        </WelcomeRow>
        <WelcomeRow left={<Uu5Elements.Icon icon="mdi-monitor" className={Css.icon()} />}>
          <Uu5Elements.Text category="story" segment="body" type="common">
            <Lsi import={importLsi} path={["Home", "clientSide"]} />
          </Uu5Elements.Text>
        </WelcomeRow>
        <WelcomeRow left={<Uu5Elements.Icon icon="mdi-server" className={Css.icon()} />}>
          <Uu5Elements.Text category="story" segment="body" type="common">
            <Lsi import={importLsi} path={["Home", "serverSide"]} />
          </Uu5Elements.Text>
        </WelcomeRow>
      </div>
    );
    //@@viewOff:render
     */
  },
});


Home = withRoute(Home, { authenticated: false });

//@@viewOn:exports
export { Home };
export default Home;
//@@viewOff:exports
