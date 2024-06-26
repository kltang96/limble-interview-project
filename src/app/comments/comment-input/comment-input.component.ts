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
  showMenu = false
  pingInitPosition: number | undefined
  pingRange: Range | undefined
  users: User[]

  @ViewChild('content') content: ElementRef = new ElementRef('div')

  @Output() submitComment: EventEmitter<string> = new EventEmitter<string>()

  constructor(public userService: UserService) {
    this.users = userService.users
  }

  @HostListener('input')
  onCommentFormChange() {
    let sanitizedHtml = stripHtml(this.content.nativeElement.innerHTML, {ignoreTags: ['ping', 'br']}).result
    this.newCommentContent.setValue(sanitizedHtml)
  }

  onCommentFormPaste($event: ClipboardEvent) {
    $event.preventDefault()
    let sanitizedHtml = stripHtml(
      $event.clipboardData?.getData("text/html") || $event.clipboardData?.getData("text/plain") || '',
      {ignoreTags: ['ping', 'br']}).result
    this._manualPaste(sanitizedHtml)
  }

  onCommentFormDrag($event: DragEvent) {
    $event.preventDefault()
    let sanitizedHtml = stripHtml(
      $event.dataTransfer?.getData("text/html") || $event.dataTransfer?.getData("text/plain") || '',
      {ignoreTags: ['ping', 'br']}).result
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

  onKeyDown($event: any) {
    if(this.showMenu) {
      if($event.key === 'Tab') {
        this.resetMenuEvent()
        $event.preventDefault()
      }
      if($event.key === ' ') {
        this.resetMenuEvent()
      }
      if($event.key === 'Enter') {
        this.insertPing(this.users[0])
        $event.preventDefault()
      }
    }
    else {
      if($event.key === 'Enter') {
        $event.preventDefault()
      }
    }
  }

  onKeyUp($event: any) {

    let cursorPosition = window.getSelection()?.getRangeAt(0).startOffset ?? 0
    let currentNode = window.getSelection()?.getRangeAt(0).commonAncestorContainer

    let isShowMenuEvent = currentNode?.nodeValue?.charAt(cursorPosition-1) === "@" // check that @ is at cursor
      && (cursorPosition <= 1 // checks if the key was typed immediately at the beginning of an html tag
        || currentNode?.nodeValue?.charAt(cursorPosition-2) === ' ') // OR if it was typed after a space

    if(isShowMenuEvent) {
      this.showMenu = true
      this.pingInitPosition = cursorPosition
    }

    if(this.showMenu) {
      if($event.key === 'Escape' || cursorPosition < (this.pingInitPosition ?? 0)) {
        this.resetMenuEvent()
      }
      if(this.pingInitPosition != null && currentNode != null) {

        // filter users based on input
        let userFilter = currentNode.nodeValue?.substring(this.pingInitPosition, cursorPosition) ?? ''
        this.users = this.userService.users.filter(
          user => {return user.name.toLowerCase().includes(userFilter.toLowerCase())}
        )
        if(this.users.length === 0) {
          this.resetMenuEvent()
        }

        // tracks what text to replace if the user selectes a ping
        this.pingRange = document.createRange()
        this.pingRange.setStart(currentNode, this.pingInitPosition-1)
        this.pingRange.setEnd(currentNode, cursorPosition)
      }
    }
  }

  insertPing(user: User) {
    if(this.content.nativeElement === document.activeElement) {
      this._insertPingTag(user)
    }
    this.onCommentFormChange()
    this.resetMenuEvent()
  }

  private _insertPingTag(user: User) {
    const selection = window.getSelection();

    if (!selection?.rangeCount) {
      return
    }
    if(this.pingRange != null) {
      selection.removeAllRanges() // Chrome requires this, Firefox does not. Firefox may not be following spec.
      selection.addRange(this.pingRange)
    }

    selection.deleteFromDocument();
    selection.collapseToEnd()

    // creates the <ping> tag: <ping userId="#" contenteditable="false">[arbitrary_text]<ping>
    let ping = document.createElement('ping')
    ping.innerHTML = '@' + user.name
    ping.setAttribute('userId', user.userID.toString());
    ping.setAttribute('contenteditable', "false");
    selection.getRangeAt(0).insertNode(document.createTextNode(' '));
    selection.getRangeAt(0).insertNode(ping);

    selection.collapseToEnd()
  }

  resetMenuEvent() {
    this.showMenu = false
    this.pingInitPosition = undefined
    this.pingRange = undefined
    this.users = this.userService.users
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
