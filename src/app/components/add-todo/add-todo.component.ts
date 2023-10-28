import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Todo } from 'src/app/models/todo';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/auth.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {
  todosCollection: AngularFirestoreCollection<Todo>;
  user: User | null = null;
  taskFormControl = new FormControl('', [Validators.required]);
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) {
    this.todosCollection = afs.collection<Todo>('todos');
   }

  ngOnInit(): void {
    this.auth.user$.subscribe((user: User|null) => {
      this.user = user;
    });
  }

  addTodo(){
    const inputValue=this.taskFormControl.value;
    if(inputValue && this.user){
      this.todosCollection.add({
        isCompleted: false,
        title: inputValue,
        userId: this.user.uid
      });
      this.taskFormControl.reset();
    }
    
  }
  getErrorMessage() {
    if (this.taskFormControl.hasError('required')) {
      return 'You must enter a value';
    }

    return this.taskFormControl.hasError('email') ? 'Not a valid email' : '';
  }

}
