import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HubConnection,HubConnectionBuilder } from '@aspnet/signalr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ChatApplication';
  private  _hubConnection: HubConnection;
  nick = '';
  message = '';
  messages: string[] = [];
  constructor() { }

  ngOnInit() {
    this.nick = window.prompt('Your name:', 'Emily');
  
    this._hubConnection = new HubConnectionBuilder().withUrl("https://localhost:44382/chatHub").build();

    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

      this._hubConnection.on('SendMessage', (nick: string, receivedMessage: string) => {
        const text = `${nick}: ${receivedMessage}`;
        this.messages.push(text);
      });
  }

  public sendMessage(): void {
    this._hubConnection
      .invoke('SendMessage', this.nick, this.message)
      .then(() => this.message = '')
      .catch(err => console.error(err));
  }
}
