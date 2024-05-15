import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { BehaviorSubject, Observable } from "rxjs";
import { NotificationEvent } from "./interfaces";

@Injectable({
  providedIn: 'root',

})
export class NotificationService{

  private message: BehaviorSubject<NotificationEvent|null> = new BehaviorSubject<NotificationEvent|null>(null)

  constructor(private messageService: MessageService) {
    this.message.subscribe(data => {
      if (data == null) {
        return
      }

      this.messageService.add(data)
    })
  }

  get NotificationSubject(): Observable<NotificationEvent|null> {
    return this.message.asObservable()
  }

  set notification(newMessage:NotificationEvent) {
    this.message.next(newMessage)
  }
}
