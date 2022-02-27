import {
  Window,
  Widget,
  WidgetState,
  IWidgetStateEvent,
  States,
  InputType,
} from "./core";
import { SVG, Svg, G, Circle, Text } from "./core";
import { CheckBox } from "./checkbox";

class CheckBoxGroup extends Widget {
  private _list1: CheckBox[] = [];
  private _group: G;
  private num: number;
  private defaultNum: number = 3;
  constructor(parent: Window) {
    super(parent);
    this.num = this.defaultNum;
    this.render();
  }

  get list1(): CheckBox[] {
    return this._list1;
  }

  move(x: number, y: number): void {
    for (var i = 0; i < this.num; i++) {
      this.list1[i].move(x, y + 40 * i);
    }
    this.update();
  }
  render(): void {
    this._group = this.parent.window.group();
    for (var x = 0; x < this.num; x++) {
      var checkBox = new CheckBox(this.parent, x + 1);
      this.list1.push(checkBox);
      this.registerEvent(this.list1[x].group);
    }
    this.registerEvent(this._group);
  }
  update(): void {}
  transition(inputType: InputType, event: any): void {
    if (
      inputType != InputType.KeyPress &&
      event.srcElement.instance.node.id >= 1
    ) {
      var previous = this.currentState();
      if (inputType == InputType.MouseDown) {
        if (this.currentState() == States.Hover) {
          this.current = States.Pressed;
          this.pressedstate();
        }
      } else if (inputType == InputType.MouseUp) {
        if (this.currentState() == States.HoverPressed) {
          this.current = States.Hover;
          this.hoverstate();
        } else if (this.currentState() == States.IdleDn) {
          this.current = States.IdleUp;
        } else if (this.currentState() == States.Pressed) {
          this.current = States.Hover;
          this.hoverstate();
          this.pressrelease();
        }
      } else if (inputType == InputType.MouseOver) {
        if (this.currentState() == States.IdleDn) {
          this.current = States.HoverPressed;
        } else if (this.currentState() == States.IdleUp) {
          this.current = States.Hover;
          this.hoverstate();
        } else if (this.currentState() == States.PressedOut) {
          this.current = States.Pressed;
        }
      } else if (inputType == InputType.MouseOut) {
        if (this.currentState() == States.HoverPressed) {
          this.current = States.IdleDn;
        } else if (this.currentState() == States.Hover) {
          this.current = States.IdleUp;
          this.idleupstate();
        } else if (this.currentState() == States.Pressed) {
          this.current = States.PressedOut;
        }
      }
      if (previous != this.currentState()) {
        this.raise(inputType, event);
      }
    }
  }
  private hoverstate() {}
  private pressrelease() {}
  private idleupstate() {}
  private pressedstate() {}
}
export { CheckBoxGroup };
