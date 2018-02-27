/*import {TodoPage} from './todo-list.po';
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

    it('should get and highlight Todos title attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Todos');
    });

    it('should type something in filter body box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeAName('Nostrud');
        expect(page.getUniqueTodo('kittypage@surelogic.com')).toEqual('Kitty Page');
        page.backspace();
        page.typeAName('lynn');
        expect(page.getUniqueTodo('lynnferguson@niquent.com')).toEqual('Lynn Ferguson');
    });

    it('should click on the age 27 times and return 3 elements then ', () => {
        page.navigateTo();
        page.getTodoByAge();
        for (let i = 0; i < 27; i++) {
            page.selectUpKey();
        }

        expect(page.getUniqueTodo('stokesclayton@momentia.com')).toEqual('Stokes Clayton');

        expect(page.getUniqueTodo('merrillparker@escenta.com')).toEqual('Merrill Parker');
    });

    it('Should open the expansion panel and get the company', () => {
        page.navigateTo();
        page.getCompany('DATA');
        browser.actions().sendKeys(Key.ENTER).perform();

        expect(page.getUniqueTodo('valerieerickson@datagene.com')).toEqual('Valerie Erickson');

        // This is just to show that the panels can be opened
        browser.actions().sendKeys(Key.TAB).perform();
        browser.actions().sendKeys(Key.ENTER).perform();
    });

    it('Should allow us to filter todos based on company', () => {
        page.navigateTo();
        page.getCompany('o');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(4);
        });
        expect(page.getUniqueTodo('conniestewart@ohmnet.com')).toEqual('Connie Stewart');
        expect(page.getUniqueTodo('stokesclayton@momentia.com')).toEqual('Stokes Clayton');
        expect(page.getUniqueTodo('kittypage@surelogic.com')).toEqual('Kitty Page');
        expect(page.getUniqueTodo('margueritenorton@recognia.com')).toEqual('Marguerite Norton');
    });

    it('Should allow us to clear a search for company and then still successfully search again', () => {
        page.navigateTo();
        page.getCompany('m');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(2);
        });
        page.clickClearCompanySearch();
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(10);
        });
        page.getCompany('ne');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(3);
        });
    });

    it('Should allow us to search for company, update that search string, and then still successfully search', () => {
        page.navigateTo();
        page.getCompany('o');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(4);
        });
        element(by.id('todoCompany')).sendKeys('h');
        element(by.id('submit')).click();
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(1);
        });
    });

// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

    it('Should have an add todo button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when add todo button is clicked', () => {
        page.navigateTo();
        expect(element(by.css('add-todo')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.id('addNewTodo')).click();
        expect(element(by.css('add-todo')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually add the todo with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        element(by.id('nameField')).sendKeys('Tracy Kim');
        // Need to use backspace because the default value is -1. If that changes, this will change too.
        element(by.id('ageField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
            element(by.id('ageField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
                element(by.id('ageField')).sendKeys('26');
            });
        });
        element(by.id('companyField')).sendKeys('Awesome Startup, LLC');
        element(by.id('emailField')).sendKeys('tracy@awesome.com');
        element(by.id('confirmAddTodoButton')).click();
        // This annoying delay is necessary, otherwise it's possible that we execute the `expect`
        // line before the add todo has been fully processed and the new todo is available
        // in the list.
        setTimeout(() => {
            expect(page.getUniqueTodo('tracy@awesome.com')).toMatch('Tracy Kim.*'); // toEqual('Tracy Kim');
        }, 10000);
    });

    it('Should allow us to put information into the fields of the add todo dialog', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        expect(element(by.id('nameField')).isPresent()).toBeTruthy('There should be a name field');
        element(by.id('nameField')).sendKeys('Dana Jones');
        expect(element(by.id('ageField')).isPresent()).toBeTruthy('There should be an age field');
        // Need to use backspace because the default value is -1. If that changes, this will change too.
        element(by.id('ageField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
            element(by.id('ageField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
                element(by.id('ageField')).sendKeys('24');
            });
        });
        expect(element(by.id('companyField')).isPresent()).toBeTruthy('There should be a company field');
        element(by.id('companyField')).sendKeys('Awesome Startup, LLC');
        expect(element(by.id('emailField')).isPresent()).toBeTruthy('There should be an email field');
        element(by.id('emailField')).sendKeys('dana@awesome.com');
        element(by.id('exitWithoutAddingButton')).click();
    });
});
*/
