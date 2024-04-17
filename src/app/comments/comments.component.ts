import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import comments from 'assets/comments.json';
import { CommentComponent } from './comment/comment.component';
import { Comment } from './models/comment';
import { stripHtml } from "string-strip-html";
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommentComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  comments: Comment[] = comments
  newCommentContent: FormControl = new FormControl('', Validators.required)

  @ViewChild('content') content: ElementRef = new ElementRef('div')

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
    let comment: Comment = {
      id: comments.length,
      time: new Date().toISOString(),
      userName: this.userService.currentUser?.name || 'System',
      content: this.newCommentContent.value
    }
    comments.unshift(comment)

    this.content.nativeElement.innerHTML = ''
    this.onCommentFormChange()
  }

  stopEvent($event: Event) {
    $event.preventDefault()
  }
}
