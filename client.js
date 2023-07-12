const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("todo.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDef)
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("0.0.0.0:4000", grpc.credentials.createInsecure())

client.createTodo({
  "id": -1,
  "text": "Laundry"
}, (_, response) => {
  console.log("Todo Created :" + JSON.stringify(response))
})

// client.readTodos({}, (err, res) => {
//   if (err) {
//     console.log("Error: ", err)
//   } else {
//     console.log("TODO(s): ", res)
//   }
// })

const call = client.readTodosStream();
call.on("data", item => {
  console.log("Received item from server ", JSON.stringify(item))
})
call.on('end', (e) => {
  if (e) console.log("Error in streaming data: ", e)
  console.log("End of stream!")  
})
