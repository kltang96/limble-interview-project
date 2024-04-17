import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Output, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { stripHtml } from "string-strip-html";
import { UserService } from 'app/services/user.service';
import { User } from 'app/models/user';

@Component({
  selector: 'app-comment-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-input.component.html',
  styleUrl: './comment-input.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CommentInputComponent {
  newCommentContent: FormControl = new FormControl('', Validators.required)
  showMenu = true

  @ViewChild('content') content: ElementRef = new ElementRef('div')

  @Output() submitComment: EventEmitter<string> = new EventEmitter<string>()

  constructor(public userService: UserService) { }

  @HostListener('input')
  onCommentFormChange() {
    let sanitizedHtml = stripHtml(this.content.nativeElement.innerHTML, {ignoreTags: ['ping', 'div', 'br']}).result
    this.newCommentContent.setValue(sanitizedHtml)
  }

  onCommentFormPaste($event: ClipboardEvent) {
    $event.preventDefault()
    let sanitizedHtml = stripHtml($event.clipboardData?.getData("text/html") || '', {ignoreTags: ['ping', 'div', 'br']}).result
    console.log("||||", sanitizedHtml)
    this._manualPaste(sanitizedHtml)
  }


  onCommentFormDrag($event: DragEvent) {
    $event.preventDefault()
    let sanitizedHtml = stripHtml($event.dataTransfer?.getData("text/html") || '', {ignoreTags: ['ping', 'div', 'br']}).result
    this._manualPaste(sanitizedHtml)
  }

  private _manualPaste(text: string) {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    selection.deleteFromDocument();
    let span = document.createElement('span')
    span.innerHTML = text
    selection.getRangeAt(0).insertNode(span);
    selection.collapseToEnd()
    this.onCommentFormChange()
  }

  onKeyUp($event: any) {

  }

  insertPing(user: User) {
    if(this.content.nativeElement === document.activeElement) {
      this._insertPingTag(user)
    }
  }

  private _insertPingTag(user: User) {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    selection.deleteFromDocument();

    let ping = document.createElement('ping')
    ping.innerHTML = '@' + user.name
    ping.setAttribute('userId', user.userID.toString());
    ping.setAttribute('contenteditable', "false");
    selection.getRangeAt(0).insertNode(document.createTextNode(' '));
    selection.getRangeAt(0).insertNode(ping);
    selection.getRangeAt(0).insertNode(document.createTextNode(' '));

    selection.collapseToEnd()
    this.onCommentFormChange()
  }

  onSubmit() {
    this.submitComment.emit(this.newCommentContent.value)

    this.content.nativeElement.innerHTML = ''
    this.onCommentFormChange()
  }

  stopEvent($event: Event) {
    $event.preventDefault()
  }
}
