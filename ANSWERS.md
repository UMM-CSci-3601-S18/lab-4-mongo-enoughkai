## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. We use Server to access UserContoller which get the data and form them from DB.
2. We pass the ID as a string into the method UserController.getUser(String) and the method get access to the DB and find the info and return it.
3. This method takes a Map type as input which would be the information we entered on website as input. The method searchs the key in the input as a filter key to filter the users in the DB and return the matching ones. filedoc is a document type object. It contains the matching ones, reforms them into a document, and returns itself.
4. The document objects we used in UserController is a tool for us to edit javascript information in java. Since our server is wrote in java but the MongoDB is wrote in javascript, this object type would allow us to write in content use java and converts into javascrips, and send back to the MongoDB.
5. This is one of the server side JUint test, and this method build a new DB through document type object and work as a MongoDB just for this test.
6. This is another JUnit test for server side. In this method, it tests the numbet of users who are 37 years old. And it filters the DB and get matched data. Then it compare the name-list to see is they matches.
7. UserRequestHandler accpets req from the client side and call the method addNewUser in UserContoller in order to add a new user in DB.
