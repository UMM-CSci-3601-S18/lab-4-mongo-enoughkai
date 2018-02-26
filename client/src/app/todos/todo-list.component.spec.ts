import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

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
                    _id: 'jubair_id',
                    owner: 'Veronica',
                    status: false,
                    body: 'Dhanmondi Tutorials',
                    category: 'Soccer Player'
                },
                {
                    _id: 'Salvi_id',
                    owner: 'Michelle',
                    status: false,
                    body: 'BIT',
                    category: 'Just playa'
                },
                {
                    _id: 'Maureen_id',
                    owner: 'Yogi',
                    status: true,
                    body: 'Fridley high school',
                    category: 'Is an amazing person'
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [TodoListComponent],
            // providers:    [ TodoListService ]  // NO! Don't provide the real service!
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

    it('contains all the todos', () => {
        expect(todoList.todos.length).toBe(3);
    });

    it('contains a todo named \'Jubair\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Jubair')).toBe(true);
    });

    it('contain a todo named \'Salvi\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Salvi')).toBe(true);
    });

    it('doesn\'t contain a todo named \'Jesus\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Jesus')).toBe(false);
    });

    it('todo list filters by owner', () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoOwner = 'a';
        todoList.refreshTodos().subscribe(() => {
            expect(todoList.filteredTodos.length).toBe(2);
        });
    });

    //Write down more tests about STATUS todo lists HERE

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
                providers: [{provide: TodoListService, useValue: toodListServiceStub},
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
            // Since the observer throws an error, we don't expect users to be defined.
            expect(todoList.todos).toBeUndefined();
        });
    });


    describe('Adding a todo', () => {
        let todoList: TodoListComponent;
        let fixture: ComponentFixture<TodoListComponent>;
        const newTodo: Todo = {
            _id: 'jubair_id',
            owner: 'Veronica',
            status: false,
            body: 'Dhanmondi Tutorials',
            category: 'Soccer Player'
        };
        const newId = 'jubar_id';

        let calledTodo: Todo;

        let todoListServiceStub: {
            getTodos: () => Observable<Todo[]>,
            addNewTodo: (newTodo: Todo) => Observable<{ '$oid': string }>
        };
        let mockMatDialog: {
            open: (AddTodoComponent, any) => {
                afterClosed: () => Observable<Todo>
            };
        };

        beforeEach(() => {
            calledTodo = null;
            // stub TodoService for test purposes
            TodoListServiceStub = {
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
})
