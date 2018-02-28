import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TodoPage {
    navigateTo(): promise.Promise<any> {
        return browser.get('/todos');
    }

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }
    selectDownKey() {
        browser.actions().sendKeys(Key.ARROW_DOWN).perform();
    }

    selectEnter() {
        browser.actions().sendKeys(Key.ENTER).perform();
    }

    getTodoTitle() {
        const title = element(by.id('todo-list-title')).getText();
        this.highlightElement(by.id('todo-list-title'));

        return title;
    }

    typeAOwner(owner: string) {
        const input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(owner);
    }

    getBody(body: string) {
        const input = element(by.id('todoBody'));
        input.click();
        input.sendKeys(body);
        const selectButton = element(by.id('submit'));
        selectButton.click();
    }

    getUniqueTodo(category: string) {
        const todo = element(by.id(category)).getText();
        this.highlightElement(by.id(category));

        return todo;
    }

    getUniqueTodo2(body: string) {
        const todo = element(by.id(body)).getText();
        this.highlightElement(by.id(body));

        return todo;
    }

    getUniqueTodo3(owner: string) {
        const todo = element(by.id(owner)).getText();
        this.highlightElement(by.id(owner));

        return todo;
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).isPresent();
    }

    clickAddTodoButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).click();
    }

    chooseCompleteStatus() {
        const input = element(by.id('complete'));
        input.click();
    }

    chooseIncompleteStatus() {
        const input = element(by.id('incomplete'));
        input.click();
    }

    chooseAllStatuses() {
        const input = element(by.id('allStatus'));
        input.click();
    }
    chooseGroceries() {
        const input = element(by.id('categoryList'));
        input.click();
        this.selectDownKey();
        this.selectEnter();
    }

    chooseHomework() {
        const input = element(by.id('categoryList'));
        input.click();
        this.selectDownKey();
        this.selectDownKey();
        this.selectEnter();
    }

    chooseSoftwareDesign() {
        const input = element(by.id('categoryList'));
        input.click();
        this.selectDownKey();
        this.selectDownKey();
        this.selectDownKey();
        this.selectEnter();
    }

    chooseVideoGames() {
        const input = element(by.id('categoryList'));
        input.click();
        this.selectDownKey();
        this.selectDownKey();
        this.selectDownKey();
        this.selectDownKey();
        this.selectEnter();
    }



}

