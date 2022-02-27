// importing local code, code we have written
import {
  Window,
  Widget,
  WidgetState,
  IWidgetStateEvent,
  States,
  InputType,
} from "./core";
import { SVG, Svg, G, Rect, Line, Text } from "./core";

class CheckBox extends Widget {
  private _rect: Rect;
  private _checkMark1: Line;
  private _checkMark2: Line;
  private _group: G;
  private _text: Text;
  private _input: string;
  private _id: number;
  private _fontSize: number;
  private _text_y: number;
  private _text_x: number;
  private defaultText: string = "Check Box";
  private defaultFontSize: number = 18;
  private defaultWidth: number = 30;
  private defaultHeight: number = 30;
  private _checked: boolean = false;
  private defaultColor: string = "#0884fc";
  private lightColor: string = "#51a8fd";
  private insideDefaultColor: string = "white";

  constructor(parent: Window, id: number) {
    super(parent);
    this.height = this.defaultHeight;
    this.width = this.defaultWidth;
    this._input = this.defaultText;
    this._id = id;
    this._fontSize = this.defaultFontSize;
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

  select() {
    this._checkMark1.opacity(100);
    this._checkMark2.opacity(100);
    this.checked = true;
  }

  set fontSize(size: number) {
    this.update();
  }

  unselect() {
    this._checkMark1.opacity(0);
    this._checkMark2.opacity(0);
    this.checked = false;
  }

  move(x: number, y: number): void {
    if (this._group != null) this._group.move(x, y);
    this.update();
  }

  render(): void {
    this._group = this.parent.window.group();
    this._rect = this._group
      .rect(this.width, this.height)
      .stroke({ color: "black", width: 2 });

    this._checkMark1 = this._group
      .line(5, 20, 10, 25)
      .stroke({
        color: this.insideDefaultColor,
        width: 3,
        linecap: "round",
        linejoin: "round",
      })
      .opacity(0);
    this._checkMark2 = this._group
      .line(10, 25, 27, 5)
      .stroke({
        color: this.insideDefaultColor,
        width: 3,
        linecap: "round",
        linejoin: "round",
      })
      .opacity(0);
    this._rect.attr("id", this._id);
    this._checkMark1.attr("id", this._id);
    this._checkMark2.attr("id", this._id);

    this._text = this._group
      .text(this._input)
      .fill("black")
      .font({ family: "Helvetica" })
      .move(this.width + 10, this.height / 4)
      .attr("id", -1);

    this._group
      .rect(this.width, this.height)
      .stroke({ color: "black", width: 3 })
      .opacity(0)
      .attr("id", this._id);

    this.registerEvent(this._group);
    this.registerEvent(this._rect);
  }

  update(): void {
    if (this._rect != null) this._rect.fill(this.backcolor);
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
    this.backcolor = this.lightColor;
    this._rect.stroke({ width: 3 });
  }
  private pressrelease() {}
  private idleupstate() {
    this.backcolor = this.defaultColor;
    this._rect.stroke({ width: 2 });
  }
  private pressedstate() {
    this.backcolor = this.defaultColor;
    if (this.checked) {
      this._checkMark1.opacity(0);
      this._checkMark2.opacity(0);
      this.checked = false;
    } else {
      this._checkMark1.opacity(100);
      this._checkMark2.opacity(100);
      this.checked = true;
    }
  }
}

export { CheckBox };
