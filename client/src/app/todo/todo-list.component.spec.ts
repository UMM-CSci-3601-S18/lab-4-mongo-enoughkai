import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

import {CustomModule} from '../custom.module';

import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';


describe('Todo list', () => {

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    _id: 'Jubair_id',
                    owner: 'Jubair',
                    status: true,
                    category: 'Soccer',
                    body: 'Player'
                },
                {
                    _id: 'Salvi_id',
                    owner: 'Salvi',
                    status: false,
                    category: 'GP',
                    body: 'CA'
                },
                {
                    _id: 'Wahid_id',
                    owner: 'Wahid',
                    status: true,
                    category: 'Spooner',
                    body: 'CA'
                },
            ])
        };


        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [TodoListComponent],
            // providers:    [ TodoListService ]  //
            // Provide a test-double instead
            providers: [{provide: TodoListService, useValue: todoListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the owners', () => {
        expect(todoList.todos.length).toBe(3);
    });

    it('contains a user named \'Jubair\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Jubair')).toBe(true);
    });

    it('contains a user named \'Salvi\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Salvi')).toBe(true);
    });

    it('contains a user named \'Jesus\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Jesus')).toBe(false);
    });

    it('has two todos that are true', () => {
        expect(todoList.todos.filter((todo: Todo) => todo.status === true).length).toBe(2);
    });

    it('todo list filters by body', () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoBody = 'Player';
        todoList.refreshTodos().subscribe(() => {
            expect(todoList.filteredTodos.length).toBe(1);
        });
    });

    it('todo list filters by category', () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoCategory = 'GP';
        todoList.refreshTodos().subscribe(() => {
            expect(todoList.filteredTodos.length).toBe(1);
        });
    });


    it('todo list filters by category and owner', () => {

        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoCategory = 'GP';
        todoList.todoBody = 'a';
        todoList.refreshTodos().subscribe(() => {
            expect(todoList.filteredTodos.length).toBe(1);
        });
    });
});


describe('Misbehaving Todo List', () => {
        let todoList: TodoListComponent;
        let fixture: ComponentFixture<TodoListComponent>;

        let todoListServiceStub: {
            getTodos: () => Observable<Todo[]>
        };

        beforeEach(() => {
            // stub TodoService for test purposes
            todoListServiceStub = {
                getTodos: () => Observable.create(observer => {
                    observer.error('Error-prone observable');
                })
            };

            TestBed.configureTestingModule({
                imports: [FormsModule, CustomModule],
                declarations: [TodoListComponent],
                providers: [{provide: TodoListService, useValue: todoListServiceStub},
                    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
            });
        });

        beforeEach(async(() => {
            TestBed.compileComponents().then(() => {
                fixture = TestBed.createComponent(TodoListComponent);
                todoList = fixture.componentInstance;
                fixture.detectChanges();
            });
        }));

        it('generates an error if we don\'t set up a TodoListService', () => {
            // Since the observer throws an error, we don't expect todos to be defined.
            expect(todoList.todos).toBeUndefined();
        });
    });


describe('Adding a todo', () => {
        let todoList: TodoListComponent;
        let fixture: ComponentFixture<TodoListComponent>;
        const newTodo: Todo = {
            _id: '',
            owner: 'Ahnaf',
            status: false,
            category: 'CSci',
            body: 'Doing lab'
        };
        const newId = 'Ahnaf_id';

        let calledTodo: Todo;

        let todoListServiceStub: {
            getTodos: () => Observable<Todo[]>,
            addNewTodo: (newTodo: Todo) => Observable<{ '$oid': string}>
        };
        let mockMatDialog: {
            open: (AddTodoComponent, any) => {
                afterClosed: () => Observable<Todo>
            };
        };

        beforeEach(() => {
            calledTodo = null;
            // stub TodoListService for test purposes
            todoListServiceStub = {
                getTodos: () => Observable.of([]),
                addNewTodo: (newTodo: Todo) => {
                    calledTodo = newTodo;
                    return Observable.of({
                        '$oid': newId
                    });
                }
            };
            mockMatDialog = {
                open: () => {
                    return {
                        afterClosed: () => {
                            return Observable.of(newTodo);
                        }
                    };
                }
            };

            TestBed.configureTestingModule({
                imports: [FormsModule, CustomModule],
                declarations: [TodoListComponent],
                providers: [
                    {provide: TodoListService, useValue: todoListServiceStub},
                    {provide: MatDialog, useValue: mockMatDialog},
                    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
            });
        });

        beforeEach(async(() => {
            TestBed.compileComponents().then(() => {
                fixture = TestBed.createComponent(TodoListComponent);
                todoList = fixture.componentInstance;
                fixture.detectChanges();
            });
        }));

        it('calls TodoListService.addTodo', () => {
            expect(calledTodo).toBeNull();
            todoList.openDialog();
            expect(calledTodo).toEqual(newTodo);
        });


    });
