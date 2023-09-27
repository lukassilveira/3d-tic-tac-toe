from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler


class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ("/RPC2",)

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        SimpleXMLRPCRequestHandler.end_headers(self)


with SimpleXMLRPCServer(("localhost", 8000), requestHandler=RequestHandler) as server:
    server.register_introspection_functions()

    def multiplicar(x, y):
        return x * y

    def testRequest():
        return 'sucesso'

    server.register_function(multiplicar, "multiplicar")
    server.register_function(testRequest, "testRequest")

    # Inicie o servidor
    print("Servidor XML-RPC escutando na porta 8000...")
    server.serve_forever()
