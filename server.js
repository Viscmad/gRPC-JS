const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("todo.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDef)
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.addService(todoPackage.Todo.service, {
  "createTodo": createTodo,
  "readTodos": readTodos,
  "readTodosStream": readTodosStream
})
server.bindAsync("0.0.0.0:4000", grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.log("Sever.BindAsync Error: ", error)
    process.exit(1)
  }
  console.log("Server.BindAsync successfully binded to ", port)
 
  server.start();
})

const todos = []

function createTodo (call, callback) {
  const todoItem = {
    "id": todos.length  + 1,
    "text": call.request.text
  }
  todos.push(todoItem)
  callback(null, todoItem)
}

function readTodos (_, callback) {
  if (todos.length === 0) callback("No Todos!", [])
  callback(null, {"items": todos}) 
}

function readTodosStream(call, _) {
  todos.forEach(t => call.write(t))
  call.end()
}
