import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { stripHtml } from "string-strip-html";
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-comment-input',
  standalone: true,
  imports: [],
  templateUrl: './comment-input.component.html',
  styleUrl: './comment-input.component.css'
})
export class CommentInputComponent {
  newCommentContent: FormControl = new FormControl('', Validators.required)

  @ViewChild('content') content: ElementRef = new ElementRef('div')

  @Output() submitComment: EventEmitter<string> = new EventEmitter<string>()

  constructor(public userService: UserService) { }

  @HostListener('input')
  onCommentFormChange() {
    let sanitizedHtml = stripHtml(this.content.nativeElement.innerHTML, {ignoreTags: ['ping']}).result
    this.newCommentContent.setValue(sanitizedHtml)
  }

  onCommentFormPaste($event: ClipboardEvent) {
    $event.preventDefault()
    let sanitizedHtml = stripHtml($event.clipboardData?.getData("text/plain") || '', {ignoreTags: ['ping']}).result
    this._manualPaste(sanitizedHtml)
  }


  onCommentFormDrag($event: DragEvent) {
    $event.preventDefault()
    let sanitizedHtml = stripHtml($event.dataTransfer?.getData("text/plain") || '', {ignoreTags: ['ping']}).result
    this._manualPaste(sanitizedHtml)
  }

  private _manualPaste(text: string) {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
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
