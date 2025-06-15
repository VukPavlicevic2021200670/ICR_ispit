import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { WebService } from '../services/web.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MessageModel } from '../models/message.model';
import { RasaModel } from '../models/rasa.model';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, HttpClientModule, NgIf, NgFor],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {
  webService = WebService.getInstance()
  userService = UserService.getInstance()
  title = 'interakcija-covek-racunar-2024'
  year = new Date().getFullYear()

  waitingForResponse = false
  botThinkingPlaceholder = 'Thinking...'
  isChatVisible = false
  userMessage: string = ''
  messages: MessageModel[] = []

  // ViewChild to access the chat-body element directly
  @ViewChild('chatBody', { static: false }) chatBody: ElementRef | undefined;

  constructor(private router: Router, private route: ActivatedRoute) { }

  public doLogout() {
    this.userService.logout()
    this.router.navigate(['/login'], { relativeTo: this.route })
  }

  ngOnInit(): void {
    // Check if there are any messages saved
    if (!localStorage.getItem('messages')) {
      localStorage.setItem('messages', JSON.stringify([
        { type: 'bot', text: 'How can I help you?' }
      ]));
    }

    this.messages = JSON.parse(localStorage.getItem('messages')!);
  }

  ngAfterViewChecked(): void {
    // Scroll to bottom after view has been updated
    if (this.chatBody) {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    }
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  pushMessage(message: MessageModel) {
    if (message.type == 'bot' && message.text == this.botThinkingPlaceholder)
      this.waitingForResponse = true

    if (message.type == 'bot' && message.text != this.botThinkingPlaceholder) {
      // Try to find the thinking placeholder message
      for (let m of this.messages) {
        if (m.type == 'bot' && m.text == this.botThinkingPlaceholder) {
          m.text = message.text
          this.waitingForResponse = false
          return
        }
      }
    }

    this.messages.push(message);
    // Save messages in local storage
    localStorage.setItem('messages', JSON.stringify(this.messages));
  }

  sendMessage() {
    // wating for response, user can't send new messages
    if (this.waitingForResponse) return

    if (this.userMessage.trim()) {
      const trimmedInput = this.userMessage;
      // Reset user input
      this.userMessage = '';

      this.pushMessage({ type: 'user', text: trimmedInput });
      this.pushMessage({ type: 'bot', text: this.botThinkingPlaceholder })
      this.webService.sendRasaMessage(trimmedInput)
        .subscribe((rsp: RasaModel[]) => {
          if (rsp.length == 0) {
            this.pushMessage({
              type: 'bot',
              text: 'Sorry I did not understand your question.'
            });
            return;
          }

          rsp.map(msg => {
            // Handle bot message (including images, flight cards, etc.)
            if (msg.image) {
              return `<img src="${msg.image}" width="200">`;
            }
            if (msg.attachment) {
              let html = '';
              for (const item of msg.attachment) {
                html += `
      <div class="card card-chat">
        <img src="${item.imageUrl || this.webService.getPetImage(item.name)}" class="card-img-top" alt="${item.name}">
        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <p class="card-text">${item.breed} • ${item.age} year${item.age === 1 ? '' : 's'} old</p>
        </div>
        <div class="card-body">
          <a class="btn btn-primary" href="/pet/${item.id}">
            <i class="fa-solid fa-up-right-from-square"></i> Details
          </a>
          <a class="btn btn-success ms-1" href="/list">
            <i class="fa-solid fa-magnifying-glass"></i> Browse All
          </a>
        </div>
      </div>
    `;
              }
              return html;
            }

            return msg.text;
          })
            .forEach(msg => {
              this.pushMessage({
                type: 'bot',
                text: msg!
              });
            });
        },
          (err: HttpErrorResponse) => {
            this.pushMessage({
              type: 'bot',
              text: 'Sorry, I am not available at the moment.'
            });
          });
    }
  }
}
