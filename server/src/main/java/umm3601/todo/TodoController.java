package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public class TodoController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;

    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection = database.getCollection("todos");
    }

    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
            = todoCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();
        if (iterator.hasNext()) {
            Document todo = iterator.next();
            return todo.toJson();
        } else {
            // We didn't find the desired todo
            return null;
        }
    }

    public String getTodos(Map<String, String[]> queryParams)  {
        Document filterDoc = new Document();

        if (queryParams.containsKey("owner")) {
            String targetContent = queryParams.get("owner")[0];
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("owner", contentRegQuery);

        }

        if (queryParams.containsKey("category")) {
            String targetContent = (queryParams.get("category")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("category", contentRegQuery);
        }

        if (queryParams.containsKey("status")) {
            boolean targetStatus = Boolean.parseBoolean(queryParams.get("status")[0]);
            filterDoc = filterDoc.append("status", targetStatus);
        }

        if (queryParams.containsKey("body")) {
            String targetContent = (queryParams.get("body")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("body", contentRegQuery);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }

    public boolean addNewTodo(String owner, String category, String body, Boolean status) {

        Document newTodo = new Document();
        newTodo.append("owner", owner);
        newTodo.append("category", category);
        newTodo.append("body", body);
        newTodo.append("status", status);

        try {
            todoCollection.insertOne(newTodo);
        }
        catch(MongoException me)
        {
            me.printStackTrace();
            return false;
        }

        return true;
    }

    public String getTodoSummary() {

        Document summaryDoc = new Document();

        String[] owners = {"Fry", "Blanche", "Barry", "Roberta", "Workman", "Dawn"};
        double[] ownerCounts = new double[6];
        double track;

        for (int i = 0; i < 6; i++) {
            Document doc = new Document("owner", owners[i]);

            ownerCounts[i] = 100 / (double)todoCollection.count(doc);
        }

        String[] categories = {"groceries", "homework", "video games", "software design"};
        double[] categoryCounts = new double[4];

        for (int i = 0; i < 4; i++) {
            Document doc = new Document("category", categories[i]);

            categoryCounts[i] = 100 / (double)todoCollection.count(doc);
        }

        double count = todoCollection.count();
        double percent = 100 / count;

        //return the percentage of todos done from the entire database
        summaryDoc.append("Total Todos Complete" , todoCollection.aggregate(
            Arrays.asList(
                Aggregates.match(Filters.eq("status", true)),
                Aggregates.group("Total", Accumulators.sum("finished todos", 1) , Accumulators.sum("percent done", percent))
            )
            )
        );

        for (int i = 0; i < 6; i++) {
            summaryDoc.append("Todos complete by " + owners[i], todoCollection.aggregate(
                Arrays.asList(
                    Aggregates.match(Filters.eq("owner", owners[i])),
                    Aggregates.match(Filters.eq("status", true)),
                    Aggregates.group("$owner", Accumulators.sum("finished todos", 1) , Accumulators.sum("percent done", ownerCounts[i]))
                )
                )
            );

        }

        for (int i = 0; i < 4; i++) {
            summaryDoc.append(categories[i] + " Todos complete", todoCollection.aggregate(
                Arrays.asList(
                    Aggregates.match(Filters.eq("category", categories[i])),
                    Aggregates.match(Filters.eq("status", true)),
                    Aggregates.group("$category", Accumulators.sum("finished todos", 1) , Accumulators.sum("percent done", categoryCounts[i]))
                )
                )
            );

        }

        return summaryDoc.toJson();
    }

    public static void main(String[] args) {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase userDatabase = mongoClient.getDatabase("dev");
        TodoController todoController = new TodoController(userDatabase);

        todoController.getTodoSummary();
    }

}
