export class WhiteboardModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
      const fields = foundry.data.fields;
      return {
        whiteboard: new fields.JSONField()
      };
    }
  }
