const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo(
  "localhost:4000",
  grpc.credentials.createInsecure()
)

console.log(`
    Option 1 Create New TodoItem
    Option 2 Read TodoItems
    Option 3 Stream TodoItems
`)
const option = process.argv[2];

if (option === '1') {
  const text = process.argv[3];
  client.createTodo({ "text": text }, (err, response) => {
    console.log("Recieved from server " + JSON.stringify(response))
  })
}

if (option === '2') {
  client.readTodos(null, (err, response) => {
    console.log("read the todos from server " + JSON.stringify(response))
    response.items.forEach(a => console.log(a.text));
  })
}

if (option === '3') {
  const call = client.readTodosStream();
  call.on("data", item => {
    console.log("received item from server " + JSON.stringify(item))
  })

  call.on("end", e => console.log("server done!"))
}