import {
  Window,
  Widget,
  WidgetState,
  IWidgetStateEvent,
  States,
  InputType,
} from "./core";
import { SVG, Svg, G, Rect, Text } from "./core";
import { RadioButton } from "./radiobutton";

class RadioButtonGroup extends Widget {
  private _list1: RadioButton[] = [];
  private _group: G;
  private _num: number;
  private _selected: number = 0;
  constructor(parent: Window, numButtons: number) {
    super(parent);
    this.num = numButtons;
    this.render();
  }
  get list1(): RadioButton[] {
    return this._list1;
  }
  get num(): number {
    return this._num;
  }

  set num(num: number) {
    this._num = num;
  }

  get selected(): number {
    return this._selected;
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
      var radioButton = new RadioButton(this.parent, x + 1);
      this.list1.push(radioButton);
      this.registerEvent(this.list1[x].group);
    }
    this.list1[this.selected].select();
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
          this.pressedstate(event);
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
  private pressedstate(event: any) {
    this._selected = event.srcElement.instance.node.id - 1;
    for (var x = 0; x < this.list1.length; x++) {
      if (x != this.selected) {
        this.list1[x].unselect();
      }
    }
  }
}
export { RadioButtonGroup };
