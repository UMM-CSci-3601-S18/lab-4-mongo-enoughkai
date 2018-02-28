
import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };

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

    it('should select the groceries category and check that correct element is returned', () => {
        page.navigateTo();
        page.chooseGroceries();
        expect(page.getUniqueTodo('58af3a600343927e48e8721e')).toEqual('check_circle\n' +
            '  Blanche');
    })

    it('should select the homework category and check that correct element is returned', () => {
        page.navigateTo();
        page.chooseHomework();
        expect(page.getUniqueTodo('58af3a600343927e48e87219')).toEqual('highlight_off\n' +
            '  Workman');
    })

    it('should select the software design category and check that correct element is returned', () => {
        page.navigateTo();
        page.chooseSoftwareDesign();
        expect(page.getUniqueTodo('58af3a600343927e48e8720f')).toEqual('highlight_off\n' +
            '  Blanche');
    })

    it('should select the video games category and check that correct element is returned', () => {
        page.navigateTo();
        page.chooseVideoGames();
        expect(page.getUniqueTodo('58af3a600343927e48e87214')).toEqual('check_circle\n' +
            '  Barry');
    })

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
// checks if we try to filter things with complete statuses

        it('should select filter by status: \'complete\' radio button and check that complete status is returned', () => {
            page.navigateTo();
            page.chooseCompleteStatus();
            expect(page.getUniqueTodo('58af3a600343927e48e87212')).toEqual('check_circle\n' +
                '  Blanche');
        })
// checks if we try to filter things with incomplete statuses
        it('should select filter by status: \'incomplete\' radio button and check that complete status is returned', () => {
            page.navigateTo();
            page.chooseIncompleteStatus();
            expect(page.getUniqueTodo('58af3a600343927e48e8720f')).toEqual('highlight_off\n' +
                '  Blanche');
        })
// checks if we try to filter things with all statuses
        it('should select filter by status: \'all\' radio button and check that complete status is returned', () => {
            page.navigateTo();
            page.chooseAllStatuses();
            page.typeAOwner('bar');
            page.getBody('Nisi sunt aliqua');
            expect(page.getUniqueTodo('58af3a600343927e48e872bc')).toEqual('check_circle\n' +
                '  Barry');
        })

    });
});
