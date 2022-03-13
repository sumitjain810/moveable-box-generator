import {
  Component,
  ElementRef,
  ViewChild,
  Renderer2,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'moveable-box-generator';
  count: number = 0;
  selectedBox: any;
  pos_x: number = 0;
  pos_y: number = 0;
  keyboardEnabled: boolean = true;

  constructor(private renderer: Renderer2) {}
  @ViewChild('boxhash') d1!: ElementRef;

  addBox = () => {
    console.log('Add Box Button Clicked...');

    const div = this.renderer.createElement('div');
    this.renderer.addClass(div, 'box');
    this.renderer.setAttribute(div, 'id', '' + ++this.count);
    this.renderer.setStyle(div, 'z-index', '' + this.count);
    this.renderer.setStyle(div, 'position', 'absolute');
    this.renderer.setStyle(div, 'left', 18 + this.count * 5 + 'px');
    this.renderer.setStyle(div, 'top', 38 + this.count * 5 + 'px');
    this.renderer.listen(div, 'click', this.boxClicked);
    this.renderer.appendChild(this.d1.nativeElement, div);
  };

  boxClicked = (e: any): void => {
    console.log('boxClicked');
    console.log(e);

    this.pos_x = e.target.offsetLeft;
    this.pos_y = e.target.offsetTop;

    for (let i = 0; i < this.d1.nativeElement.children.length; i++) {
      let temp = this.d1.nativeElement.children[i];
      if (e.target.id == temp.id) {
        this.renderer.removeClass(temp, 'box');
        this.renderer.addClass(temp, 'box-selected');
        this.selectedBox = temp;
      } else {
        this.renderer.removeClass(temp, 'box-selected');
        this.renderer.addClass(temp, 'box');
      }
    }
  };

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    console.log('handleKeyboardEvent');
    console.log(event);

    console.log('this.selectedBox');
    console.log(this.selectedBox);

    // q - toggle keyboard controls
    if (event.keyCode == 81) {
      this.toggleKeyboard();
    }

    if (this.selectedBox && this.keyboardEnabled) {
      switch (event.keyCode) {
        // up
        case 87: // w
        case 38: // arrow_up
          if (this.pos_y > 38) this.setY(--this.pos_y);
          break;

        // down
        case 83: // s
        case 40: // arrow_down
          // 38 + 500 - 50
          if (this.pos_y < 488) this.setY(++this.pos_y);
          break;

        // left
        case 65: // a
        case 37: // arrow_left
          if (this.pos_x > 18) this.setX(--this.pos_x);
          break;

        // right
        case 68: // d
        case 39: // arrow_right
          // 18 + 500 - 50
          if (this.pos_x < 468) this.setX(++this.pos_x);
          break;

        case 46: // delete
          this.renderer.removeChild(this.d1.nativeElement, this.selectedBox);
          break;

        default:
          console.log('Not Arrow Key');
          break;
      }
    }
  }

  setX = (x: number) => {
    console.log('x: ', this.pos_x);
    if (this.keyboardEnabled)
      this.renderer.setStyle(this.selectedBox, 'left', x + 'px');
  };

  setY = (y: number) => {
    console.log('y: ', this.pos_y);
    if (this.keyboardEnabled)
      this.renderer.setStyle(this.selectedBox, 'top', y + 'px');
  };

  toggleKeyboard = () => {
    this.keyboardEnabled = !this.keyboardEnabled;
  };
}
