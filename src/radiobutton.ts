// importing local code, code we have written
import {
  Window,
  Widget,
  WidgetState,
  IWidgetStateEvent,
  States,
  InputType,
} from "./core";
// importing code from SVG.js library
import { SVG, Svg, G, Circle, Text } from "./core";

class RadioButton extends Widget {
  private circle: Circle;
  private circle2: Circle;
  private _group: G;
  private _text: Text;
  private _input: string;
  private _id: number;
  private _fontSize: number;
  private _text_y: number;
  private _text_x: number;
  private defaultText: string = "Radio Button";
  private defaultFontSize: number = 18;
  private defaultWidth: number = 30;
  private defaultHeight: number = 30;
  private _checked: boolean = false;
  private insideColor: string;
  private defaultColor: string = "#0884fc";
  private lightColor: string = "#51a8fd";
  private insideDefaultColor: string = "white";

  constructor(parent: Window, id: number) {
    super(parent);
    this.height = this.defaultHeight;
    this.width = this.defaultWidth;
    this._input = this.defaultText;
    this._fontSize = this.defaultFontSize;
    this._id = id;
    this.render();
    this.idleupstate();
  }

  set text(text: string) {
    this._input = text;
    this.update();
  }

  get text(): string {
    return this._input;
  }

  get group(): any {
    return this._group;
  }

  get checked(): boolean {
    return this._checked;
  }

  set checked(checked: boolean) {
    this._checked = checked;
  }

  set fontSize(size: number) {
    this.update();
  }

  select() {
    this.circle2.opacity(100);
    this.checked = true;
  }

  unselect() {
    this.circle2.opacity(0);
    this.checked = false;
  }

  move(x: number, y: number): void {
    if (this._group != null) this._group.move(x, y);
    this.update();
  }

  render(): void {
    this._group = this.parent.window.group();
    this.circle = this._group
      .circle(this.width, this.height)
      .stroke({ color: "black", width: 2 })
      .attr("id", this._id);
    this.circle2 = this._group
      .circle(this.width - 12, this.height - 12)
      .move(6, 6)
      .opacity(0)
      .attr("id", this._id);
    this._text = this._group
      .text(this._input)
      .fill("black")
      .font({ family: "Helvetica" })
      .move(this.width + 10, this.height / 4)
      .attr("id", -1);

    this._group
      .circle(this.width, this.height)
      .stroke({ color: "black", width: 2 })
      .opacity(0)
      .attr("id", this._id);
    this.registerEvent(this._group);
    this.registerEvent(this.circle);
  }

  update(): void {
    if (this.circle != null) this.circle.fill(this.backcolor);
    if (this.circle2 != null) this.circle2.fill(this.insideColor);
    if (this._text != null) this._text.font({ size: this._fontSize });
    this._text.text(this._input);
  }

  transition(inputType: InputType, event: any): void {
    if (
      inputType != InputType.KeyPress &&
      event.srcElement.instance.node.id == this._id
    ) {
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
          this.raise(inputType, event);
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
    }
  }

  private hoverstate() {
    this.circle.stroke({ width: 3 });
    this.backcolor = this.lightColor;
  }
  private pressrelease() {}
  private idleupstate() {
    this.circle.stroke({ width: 2 });
    this.backcolor = this.defaultColor;
    this.insideColor = this.insideDefaultColor;
  }
  private pressedstate() {
    this.backcolor = this.defaultColor;
    this.circle2.opacity(100);
    this.checked = true;
  }
}

export { RadioButton };
