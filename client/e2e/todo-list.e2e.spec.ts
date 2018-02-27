
import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

describe('Todo list', () => {
    let page: TodoPage;

    beforeEach(() => {
        page = new TodoPage();
    });
// Get Todo Title Test

    it('should get and highlight Todos title attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Todos');
    });
// Filtering by body

    it('should type something in filter body box and check that it returned correct element', () => {
        page.navigateTo();
        page.getBody('Nostrud');
        expect(page.getUniqueTodo2('Eiusmod commodo officia amet aliquip est ipsum nostrud duis sunt voluptate mollit excepteur. Sunt non in pariatur et culpa est sunt.')).toEqual('Workman');
    });

//Filtering by Owner

    it('should go to owner and type have all the todos with the specific owner  ', () => {
        page.navigateTo();
        page.typeAOwner('Fry');
        browser.actions().sendKeys(Key.ENTER).perform();
        expect(page.getUniqueTodo3('Fry')).toEqual('Fry');
    });


// Checking the Todo Functionality with e2e testing

    //checks if it has todo add button

    it('Should have an add todo button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    //checks if a dialog box is opened or not

    it('Should open a dialog box when add todo button is clicked', () => {
        page.navigateTo();
        expect(element(by.css('add-todo')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.id('addNewTodo')).click();
        expect(element(by.css('add-todo')).isPresent()).toBeTruthy('There should be a modal window now');
    });
    // checks if we actually add things to the database or not

    it('Should actually add the Todo with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        element(by.id('ownerField')).sendKeys('Nic McPhee');
        element(by.id('categoryField')).sendKeys('UMM');
        element(by.id('bodyField')).sendKeys('is the best');
        element(by.id('statusField')).sendKeys('true');

        element(by.id('confirmAddTodoButton')).click();
        setTimeout(() => {
            expect(page.getUniqueTodo3('Nic McPhee')).toMatch('Nic McPhee');
        }, 10000);
    });
});
