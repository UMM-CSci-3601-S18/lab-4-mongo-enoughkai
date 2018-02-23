import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoComponent} from './todo.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';

describe('Todo component', () => {

    let todoComponent: TodoComponent;
    let fixture: ComponentFixture<TodoComponent>;

    let todoListServiceStub: {
        getTodoById: (todoId: string) => Observable<Todo>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodoById: (todoId: string) => Observable.of([
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
                    category: 'Just player'
                },
                {
                    _id: 'Maureen_id',
                    owner: 'Yogi',
                    status: true,
                    body: 'Fridley',
                    category: 'Is an amazing person'
                }
            ].find(todo => todo._id === todoId))
        };

        TestBed.configureTestingModule({
            declarations: [TodoComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoComponent);
            todoComponent = fixture.componentInstance;
        });
    }));

    it('can retrieve Jubair by ID', () => {
        todoComponent.setId('jubair_id');
        expect(todoComponent.todo).toBeDefined();
        expect(todoComponent.todo.owner).toBe('Veronica');
        expect(todoComponent.todo.category).toBe('Soccer Player');

    });

    it('returns undefined for Jesus', () => {
        todoComponent.setId('Jesus');
        expect(todoComponent.todo).not.toBeDefined();
    });

});
