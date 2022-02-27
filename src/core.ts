import {
  SVG,
  Svg,
  G,
  Container,
  Rect,
  Text,
  Box,
  Line,
  Circle,
} from "@svgdotjs/svg.js";

enum States {
  IdleUp = 1,
  IdleDn,
  Hover,
  HoverPressed,
  Pressed,
  PressedOut,
  Incrementing,
  Full,
}

enum InputType {
  MouseMove = 1,
  MouseUp,
  MouseDown,
  MouseOver,
  MouseOut,
  KeyPress,
}

interface IWidgetStateEvent {
  attach(handler: { (inputType: InputType, event: any): void }): void;
  stateEvent(): IWidgetStateEvent;
  currentState(): States;
}

class Window implements IWidgetStateEvent {
  private _window: Svg;
  private _objects: Widget[];
  private _handlers: { (inputType: InputType, event: string): void }[] = [];
  private _currentstate: States;

  constructor(height: any, width: any) {
    let body = SVG().addTo("body").size(width, height);

    body.rect(width, height).fill("white").stroke("red");
    this._window = SVG().addTo(body);
    this._currentstate = States.IdleUp;
    this.registerEvents(body);
  }

  private registerEvents(body: Svg) {
    SVG(window).on(
      "keyup",
      (event) => {
        this.raise(InputType.KeyPress, event);
      },
      window
    );

    body.mousedown((event: string) => {
      this.raise(InputType.MouseDown, event);
    });
    body.mouseup((event: string) => {
      this.raise(InputType.MouseUp, event);
    });
    body.mousemove((event: string) => {
      this.raise(InputType.MouseMove, event);
    });
  }

  get window(): Svg {
    return this._window;
  }

  stateEvent(): IWidgetStateEvent {
    return this;
  }

  currentState(): States {
    return this._currentstate;
  }

  attach(handler: { (inputType: InputType, event: string): void }): void {
    this._handlers.push(handler);
  }

  raise(inputType: InputType, event: any) {
    this._handlers.slice(0).forEach((h) => h(inputType, event));
  }
}

class WidgetState implements IWidgetStateEvent {
  private _widget: Svg;
  private _handlers: { (inputType: InputType, event: string): void }[] = [];
  private _currentstate: States;

  constructor(widget: Svg) {
    this._widget = widget;
    this._currentstate = States.IdleUp;
  }

  stateEvent(): IWidgetStateEvent {
    return this;
  }

  currentState(): States {
    return this._currentstate;
  }

  set current(state: States) {
    this._currentstate = state;
  }

  attach(handler: { (inputType: InputType, event: string): void }): void {
    this._handlers.push(handler);
  }

  raise(inputType: InputType, event: string) {
    this._handlers.slice(0).forEach((h) => h(inputType, event));
  }
}

abstract class Widget extends WidgetState {
  protected width: number;
  protected height: number;
  protected _forecolor: string;
  protected _backcolor: string;
  protected _base: Svg;

  parent: Window;

  constructor(parent: Window) {
    super(parent.window);
    parent.stateEvent().attach((inputType: InputType, event: string) => {
      this.windowTransition(inputType, event);
    });
    this.parent = parent;
  }

  private windowTransition(inputType: InputType, event: string): void {
    if (inputType == InputType.KeyPress) {
      this.transition(InputType.KeyPress, event);
    }
    if (
      this.currentState() == States.Hover ||
      this.currentState() == States.Pressed
    )
      return;

    if (inputType == InputType.MouseDown) {
      this.current = States.IdleDn;
    } else if (inputType == InputType.MouseUp) {
      this.current = States.IdleUp;
    } else if (inputType == InputType.MouseMove) {
    }
    // uncomment to view state changes in the console while debugging
    //console.log("Window: " + InputType[inputType] + " State: "+ States[this.currentState()]);
  }

  protected registerEvent(obj: any): void {
    // click and dblclick can be used for debugging, but detecting
    // clicks should occur at the level of widget using state transition
    obj.click((event: string) => {
      // this.transition(InputType.MouseUp, event);
      //console.log("clicked")
    });
    obj.dblclick((event: string) => {
      //this.transition('DBLCLICK', event);
    });
    obj.mousedown((event: string) => {
      this.transition(InputType.MouseDown, event);
    });
    obj.mouseup((event: string) => {
      this.transition(InputType.MouseUp, event);
    });
    obj.mouseover((event: string) => {
      this.transition(InputType.MouseOver, event);
    });
    obj.mouseout((event: string) => {
      this.transition(InputType.MouseOut, event);
    });
    obj.mousemove((event: string) => {
      this.transition(InputType.MouseMove, event);
    });
  }

  set backcolor(color: string) {
    this._backcolor = color;
    this.update();
  }

  get backcolor(): string {
    return this._backcolor;
  }

  set forecolor(color: string) {
    this._forecolor = color;
  }

  get forecolor(): string {
    return this._forecolor;
  }

  abstract move(x: number, y: number): void;
  abstract render(): void;
  abstract update(): void;
  abstract transition(inputType: InputType, event: string): void;
}

// local
export { Window, Widget, WidgetState, IWidgetStateEvent, States, InputType };
// from svg.js
export { SVG, Svg, G, Rect, Container, Text, Box, Line, Circle };
