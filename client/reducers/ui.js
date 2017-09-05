import Immutable from "seamless-immutable";

export default (
  state = Immutable({
    storyCreation: false,
    createdStoryId: null
  }),
  action
) => {
  switch (action.type) {
    case "@@resolve/SEND_COMMAND": {
      if (!action.command) {
        return state.merge({
          storyCreation: false,
          storyCreationError: action.status.error
        });
      }

      switch (action.command.type) {
        case "createStory": {
          return state.set("storyCreation", true);
        }
        default: {
          return state;
        }
      }
    }
    case "StoryCreated": {
      return state.merge({
        storyCreation: false,
        createdStoryId: action.aggregateId
      });
    }
    case "SUBMIT_VIEW_SHOWN": {
      return state.set("createdStoryId", null);
    }
    default: {
      return state;
    }
  }
};
