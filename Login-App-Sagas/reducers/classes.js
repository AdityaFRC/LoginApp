// @flow

import Immutable from "immutable";
import Chat from "../records/chat";

export default function(state = new Immutable.OrderedMap(), action: Object) {
  switch (action.type) {
    case "ADD_CLASS": {
      const newCreatedClass = new Chat(action.newClass);
      return state.update(
          newCreatedClass.id,
          chat => chat ? chat.mergeDeep(newCreatedClass) : newCreatedClass
      );
    }
    default:
      return state;
  }
}
